from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# مسار ملفات الموقع (الـ HTML + CSS + JS)
SITE_DIR = os.path.dirname(os.path.abspath(__file__))

# الصفحة الرئيسية
@app.route('/')
def index():
    return send_from_directory(SITE_DIR, 'index.html')

# تقديم أي ملف ثابت (CSS, JS, صور...)
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(SITE_DIR, filename)

if __name__ == '__main__':
    # شغل السيرفر على HTTPS بملفات شهادة تلقائية من pyOpenSSL
    app.run(
        host='0.0.0.0',
        port=5000,
        ssl_context='adhoc',  # ده بيعمل شهادة Self-signed أوتوماتيك
        debug=True
    )


# pip install flask pyopenssl
# python server.py
