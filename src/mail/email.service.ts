import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'

@Injectable()
export class EmailService {
  private resend: Resend

  constructor () {
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendVerificationEmail (email: string, name: string, verificationCode: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev', // Cambia por tu dominio verificado
        to: email,
        subject: 'Verifica tu cuenta - City Lights',
        html: this.getVerificationEmailTemplate(name, verificationCode)
      })
    } catch (error) {
      console.error('Error sending verification email:', error)
      throw new Error('Error al enviar el email de verificación')
    }
  }

  private getVerificationEmailTemplate (name: string, code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de Cuenta</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #4F46E5; margin-bottom: 10px; }
          .code-box { background: #f8f9fa; border: 2px dashed #4F46E5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">� City Lights</div>
            <h1>¡Bienvenido, ${name}!</h1>
            <p>Gracias por registrarte en el sistema de administración del edificio. Para completar tu registro, verifica tu email con el siguiente código:</p>
          </div>
          
          <div class="code-box">
            <p><strong>Tu código de verificación es:</strong></p>
            <div class="code">${code}</div>
            <p><small>Este código expira en 15 minutos</small></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p>Ingresa este código en la aplicación para activar tu cuenta.</p>
            <p><strong>¿No solicitaste esto?</strong> Puedes ignorar este email.</p>
          </div>
          
          <div class="footer">
            <p>© 2025 City Lights. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}
