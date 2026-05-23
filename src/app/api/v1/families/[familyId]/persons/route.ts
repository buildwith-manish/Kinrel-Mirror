import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { apiMiddleware } from '@/lib/api/middleware'
import { success, collection, error } from '@/lib/api/response'
import { handleIdempotency, storeResponse } from '@/lib/api/idempotency'
import { emit } from '@/lib/api/webhook-delivery'
import { apiVersionHeaders } from '@/lib/api/middleware'

// ── GET /v1/families/:familyId/persons ───────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ familyId: string }> }
) {
  const { familyId } = await params
  const result = await apiMiddleware(request, {
    requiredScope: 'persons:read',
    endpoint: 'GET /v1/families/*/persons',
  })

  if (result instanceof NextResponse) return result

  const { apiKey, rateLimitHeaders } = result

  // Check access
  const membership = await db.familyMember.findFirst({
    where: { familyId, userId: apiKey.userId },
  })

  if (!membership) {
    return error('NOT_FOUND', 'Family not found or access denied', 404)
  }

  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))

  // Filtering
  const gender = url.searchParams.get('gender')
  const deceased = url.searchParams.get('deceased')
  const generation = url.searchParams.get('generation')
  const search = url.searchParams.get('search') || ''
  const sort = url.searchParams.get('sort') || 'createdAt'
  const order = url.searchParams.get('order') || 'desc'

  const where: Record<string, unknown> = { familyId }

  if (deceased === 'true') where.isDeceased = true
  if (deceased === 'false') where.isDeceased = false
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { relationship: { contains: search } },
      { occupation: { contains: search } },
      { city: { contains: search } },
    ]
  }

  const [persons, total] = await Promise.all([
    db.person.findMany({
      where,
      orderBy: { [sort]: order === 'asc' ? 'asc' : 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.person.count({ where }),
  ])

  const response = collection(persons, {
    page,
    limit,
    total,
    hasMore: page * limit < total,
  })

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      ...rateLimitHeaders,
      ...apiVersionHeaders('1.0.0'),
    },
  })
}

// ── POST /v1/families/:familyId/persons ──────────────────────────────

const createPersonSchema = z.object({
  name: z.string().min(1).max(200),
  relationship: z.string().max(100).optional(),
  dateOfBirth: z.string().optional(),
  gotra: z.string().max(100).optional(),
  occupation: z.string().max(200).optional(),
  city: z.string().max(200).optional(),
  isDeceased: z.boolean().default(false),
  privacyLevel: z.enum(['family', 'extended', 'public']).default('family'),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ familyId: string }> }
) {
  const { familyId } = await params
  const result = await apiMiddleware(request, {
    requiredScope: 'persons:write',
    endpoint: 'POST /v1/families/*/persons',
  })

  if (result instanceof NextResponse) return result

  const { apiKey, rateLimitHeaders } = result

  // Check access (admin or editor)
  const membership = await db.familyMember.findFirst({
    where: {
      familyId,
      userId: apiKey.userId,
      role: { in: ['admin', 'editor'] },
    },
  })

  if (!membership) {
    return error('INSUFFICIENT_SCOPE', 'Admin or editor access required to add persons', 403)
  }

  // Check idempotency
  const idempotencyKey = request.headers.get('Idempotency-Key')
  if (idempotencyKey) {
    const idemResult = await handleIdempotency(idempotencyKey)
    if (idemResult.isDuplicate && idemResult.response) {
      return new NextResponse(JSON.stringify(idemResult.response.body), {
        status: idemResult.response.status,
        headers: {
          ...rateLimitHeaders,
          ...apiVersionHeaders('1.0.0'),
          ...idemResult.response.headers,
          'X-Idempotent-Replayed': 'true',
        },
      })
    }
  }

  // Parse body
  const body = await request.json().catch(() => null)
  if (!body) {
    return error('INVALID_PARAMETER', 'Invalid JSON body', 400)
  }

  const parsed = createPersonSchema.safeParse(body)
  if (!parsed.success) {
    const details = parsed.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
    }))
    return error('VALIDATION_ERROR', 'Request validation failed', 400, details)
  }

  const data = parsed.data

  // Verify family exists
  const family = await db.family.findUnique({ where: { id: familyId } })
  if (!family) {
    return error('NOT_FOUND', 'Family not found', 404)
  }

  // Create person
  const person = await db.person.create({
    data: {
      familyId,
      name: data.name,
      relationship: data.relationship,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gotra: data.gotra,
      occupation: data.occupation,
      city: data.city,
      isDeceased: data.isDeceased,
      privacyLevel: data.privacyLevel,
    },
  })

  // Emit webhook event
  await emit('person.created', {
    personId: person.id,
    familyId,
    name: person.name,
  }, familyId)

  // Audit log
  await db.auditLog.create({
    data: {
      userId: apiKey.userId,
      action: 'PERSON_CREATED',
      resource: 'Person',
      resourceId: person.id,
      details: JSON.stringify({ name: data.name, familyId }),
    },
  })

  const response = success(person)

  // Store idempotency response
  if (idempotencyKey) {
    await storeResponse(idempotencyKey, await response.json(), response.status, {})
  }

  return new NextResponse(response.body, {
    status: 201,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      ...rateLimitHeaders,
      ...apiVersionHeaders('1.0.0'),
    },
  })
}
