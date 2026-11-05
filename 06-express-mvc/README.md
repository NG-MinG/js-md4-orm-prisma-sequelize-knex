# 06-express-mvc — REST API theo mô hình MVC

Express 5 + Sequelize 6. Trong REST API không có HTML, nên **View là tầng biến dữ liệu thành JSON**.

| Tầng | Thư mục | Trách nhiệm | KHÔNG được làm |
| --- | --- | --- | --- |
| **M**odel | `src/models/` | Dữ liệu, ràng buộc, quan hệ, logic nghiệp vụ (`isOverdue()`, băm mật khẩu) | Biết về `req`, `res`, HTTP |
| **V**iew | `src/views/` | Quyết định JSON trả về: chọn field, đổi tên camelCase, ẩn field nhạy cảm, khuôn `{ success, data, meta }` | Truy vấn DB, chứa logic nghiệp vụ |
| **C**ontroller | `src/controllers/` | Nhận input đã validate → gọi Model → chọn View | Tự dựng JSON, gọi `res.json()` trực tiếp |

## Luồng một request

```
HTTP request
   │
   ▼
routes/            định tuyến: URL + method → middleware + controller
   │
   ▼
middlewares/validate + validators/   kiểm tra input, đổi camelCase → tên field Model (lỗi → 400)
   │
   ▼
controllers/       điều phối ──► models/ (Sequelize ──► MySQL)
   │
   ▼
views/             Model instance → JSON ──► res.status().json()

Lỗi ở bất kỳ bước nào → middlewares/error-handler → views/error.view → JSON lỗi cùng khuôn
```

## Ví dụ: cùng một Task, DB lưu một kiểu, View trả một kiểu

| Trong DB / Model | JSON do `TaskView` trả ra |
| --- | --- |
| `due_date` | `dueDate` |
| `user_id` | `owner: { id, name }` |
| `deleted_at` | (ẩn) |
| — | `isOverdue` (tính từ Model) |
| `users.password_hash` | (không bao giờ trả ra) |

Đổi tên cột trong DB → chỉ sửa View, client không bị ảnh hưởng.

## Chạy

```bash
cp .env.example .env
npm install
npm run db:reset      # migrate + seed: 3 users (mật khẩu 123456), 12 tasks
npm run dev           # http://localhost:3000/api/v1
```

## Endpoint

| Method | Path | Mô tả | Mã |
| --- | --- | --- | --- |
| GET | `/api/v1/users` | Danh sách user kèm `taskCount` (1 câu SQL) | 200 |
| GET | `/api/v1/users/:id` | User kèm danh sách task rút gọn | 200, 404 |
| POST | `/api/v1/users` | `{ name, email, password }` — password băm trong hook Model | 201, 400, 409 |
| GET | `/api/v1/tasks?page=&limit=&status=&userId=` | Phân trang, lọc, kèm `owner` | 200, 400 |
| GET | `/api/v1/tasks/:id` | Chi tiết | 200, 404 |
| POST | `/api/v1/tasks` | `{ title, description?, status?, dueDate?, userId }` | 201, 400, 404, 409 |
| PATCH | `/api/v1/tasks/:id` | Cập nhật một phần | 200, 400, 404, 409 |
| DELETE | `/api/v1/tasks/:id` | Xoá mềm | 200, 404 |

Ví dụ response:

```json
{
  "success": true,
  "data": [{
    "id": 10, "title": "Phan trang", "status": "todo", "dueDate": "2026-11-19", "isOverdue": false,
    "owner": { "id": 1, "name": "An" }, "createdAt": "...", "updatedAt": "..."
  }],
  "meta": { "page": 1, "limit": 2, "total": 4, "totalPages": 2 }
}
```

```json
{ "success": false, "message": "Dữ liệu không hợp lệ", "errors": [{ "field": "email", "message": "email không đúng định dạng" }] }
```

## Bài tập mở rộng cho học viên

1. Thêm `GET /api/v1/users/:id/tasks` — chỉ cần controller mới, tái dùng `TaskView.index`.
2. Thêm field `priority` vào Task: migration → Model → validator → View. Đếm xem phải sửa mấy tầng.
3. Đổi khuôn response sang `{ status: "ok", result }` — chứng minh chỉ cần sửa `views/base.view.js`.
