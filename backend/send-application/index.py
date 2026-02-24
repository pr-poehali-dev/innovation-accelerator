import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта КулАяк на email и уведомление клиенту."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    message = body.get('message', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'})
        }

    smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_pass = os.environ.get('SMTP_PASS')
    to_email = os.environ.get('TO_EMAIL', 'ar2r.korolev@gmail.com')

    # Письмо владельцу
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта КулАяк — {name}'
    msg['From'] = smtp_user
    msg['To'] = to_email

    html_body = f"""
    <html><body style="font-family: Arial, sans-serif; color: #1a2340; background: #f5f6f8; padding: 24px;">
      <div style="max-width: 520px; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,188,212,0.1);">
        <h2 style="color: #00acc1; margin-top: 0;">Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> {name}</p>
        <p><strong>Телефон:</strong> <a href="tel:{phone}" style="color: #00acc1;">{phone}</a></p>
        {'<p><strong>Комментарий:</strong> ' + message + '</p>' if message else ''}
        <hr style="border: none; border-top: 1px solid #e8eaf0; margin: 24px 0;">
        <p style="color: #888; font-size: 13px;">Заявка отправлена через сайт kulayak.ru</p>
      </div>
    </body></html>
    """
    msg.attach(MIMEText(html_body, 'html'))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }
