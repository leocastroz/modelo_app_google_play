import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_XcD6d65w_E97jRc5EPWNxyfUEa4j4A4RS')

export default defineEventHandler(async (event) => {
  try {
    const data = await resend.emails.send({
      from: 'Drogaria Popular <onboarding@resend.dev>',
      to: ['castroz.dev@gmail.com'],
      subject: 'Hello world, 123',
      html: '<strong>It works!</strong>',
    })

    return { success: true, data }
  } catch (error) {
    // Log server-side for debugging
    console.error('Resend error:', error)
    // Provide a safe error payload to the client
    return { success: false, error: String(error) }
  }
})
