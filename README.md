# Multilanguage Transolator

Dự án hỗ trợ dịch và xử lý đa ngôn ngữ với các tính năng nâng cao.

## Cấu trúc dự án

Dự án bao gồm 3 phần chính:

- **WEB/multilanguage_transolator_fe**: Frontend được xây dựng bằng React + Vite
- **WEB/multilanguage_transolator_be**: Backend được xây dựng bằng Django
- **AI_Pipeline**: Module xử lý trí tuệ nhân tạo

## Yêu cầu hệ thống

- Node.js (v18+)
- Python (v3.9+)
- Django
- Git

## Hướng dẫn cài đặt và chạy dự án

### 1. Clone dự án

```bash
git clone <repository_url>
cd Multilanguage_transolator
```

### 2. Cài đặt và chạy Backend

```bash
cd WEB/multilanguage_transolator_be

# Tạo và kích hoạt môi trường ảo (nếu chưa có)
python -m venv env
source env/bin/activate  # Trên Linux/Mac
# hoặc
env\Scripts\activate  # Trên Windows

# Cài đặt các thư viện Python
pip install -r requirements.txt

# Thực hiện migration database
python manage.py migrate

# Chạy server
python manage.py runserver
```

Backend sẽ chạy tại địa chỉ: http://127.0.0.1:8000/

### 3. Cài đặt và chạy Frontend

```bash
cd WEB/multilanguage_transolator_fe

# Cài đặt các thư viện
npm install

# Chạy ứng dụng trong chế độ development
npm run dev
```

Frontend sẽ chạy tại địa chỉ: http://localhost:5173/

### 4. Cài đặt AI Pipeline (nếu cần)

```bash
cd AI_Pipeline

# Tạo và kích hoạt môi trường ảo
python -m venv env
source env/bin/activate  # Trên Linux/Mac
# hoặc
env\Scripts\activate  # Trên Windows

# Cài đặt các thư viện cần thiết
pip install -r requirements.txt
```

## Cấu hình môi trường

Cả frontend và backend đều sử dụng file .env để cấu hình.

### File .env cho Backend

Tạo file .env trong thư mục WEB/multilanguage_transolator_be với nội dung:

```
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=127.0.0.1,localhost
```

### File .env cho Frontend

Tạo file .env trong thư mục WEB/multilanguage_transolator_fe với nội dung:

```
VITE_API_URL=http://localhost:8000
```

## Các tính năng chính

- Đăng nhập/Đăng ký người dùng
- Quản lý tài khoản
- Dịch đa ngôn ngữ
- Thư viện chung và riêng
- Xử lý và phân tích tài liệu

## Đóng góp

Mọi đóng góp đều được hoan nghênh. Vui lòng tạo Pull Request hoặc báo cáo Issues nếu bạn phát hiện lỗi.
