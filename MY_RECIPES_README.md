# My Recipes Page - Trang Quản Lý Món Ăn Cá Nhân

## 📋 Tổng Quan

Trang **My Recipes** cho phép người dùng quản lý bộ sưu tập công thức nấu ăn cá nhân với đầy đủ chức năng CRUD (Create, Read, Update, Delete).

## 🎯 Các Tính Năng Chính

### 1. **Thêm Món Ăn Mới**
- Nhấn nút "Add New Recipe" để mở form thêm món ăn
- Điền đầy đủ thông tin:
  - Thông tin cơ bản: Tên, mô tả, thời gian nấu, khẩu phần
  - Phân loại: Danh mục (breakfast/lunch/dinner/snack), độ khó
  - Thành phần dinh dưỡng: Calories, protein, carbs, fat, etc.
  - Nguyên liệu: Danh sách các nguyên liệu cần thiết
  - Hướng dẫn: Các bước nấu ăn chi tiết
  - Tags: Các nhãn phân loại

### 2. **Xem Chi Tiết Món Ăn**
- Click vào bất kỳ recipe card nào để xem chi tiết
- Modal hiển thị đầy đủ thông tin về món ăn
- Tái sử dụng component `RecipeDetailModal` từ MenuSuggestionPage

### 3. **Chỉnh Sửa Món Ăn**
- Click vào menu 3 chấm trên recipe card
- Chọn "Edit Recipe"
- Form sẽ được điền sẵn thông tin hiện tại
- Cập nhật và lưu thay đổi

### 4. **Xóa Món Ăn**
- Click vào menu 3 chấm trên recipe card
- Chọn "Delete Recipe"
- Xác nhận trong dialog xóa

### 5. **Tìm Kiếm và Lọc**
- **Search Bar**: Tìm kiếm theo tên, nguyên liệu, hoặc tags
- **Category Filter**: Lọc theo bữa ăn (All/Breakfast/Lunch/Dinner/Snack)
- **Difficulty Filter**: Lọc theo độ khó (All/Easy/Medium/Hard)
- **Sort Options**: Sắp xếp theo:
  - Newest First (mặc định)
  - Alphabetical (A-Z)
  - Calories
  - Cooking Time

### 6. **Thống Kê**
Hiển thị overview về bộ sưu tập:
- Tổng số công thức
- Số lượng theo từng bữa ăn
- Calories trung bình

## 🏗️ Cấu Trúc Folder

```
src/
├── components/
│   └── myRecipes/
│       ├── RecipeCard.tsx          # Card hiển thị món ăn
│       ├── RecipeFormModal.tsx     # Form thêm/sửa món ăn
│       ├── DeleteConfirmDialog.tsx # Dialog xác nhận xóa
│       └── EmptyState.tsx          # Trạng thái danh sách rỗng
├── hooks/
│   └── useMyRecipes.ts             # Custom hook quản lý CRUD
├── pages/
│   └── MyRecipesPage.tsx           # Trang chính
└── types/
    └── myRecipe.ts                 # Types cho My Recipes feature
```

## 🎨 UI/UX Features

### Thiết Kế
- **Responsive**: Hoạt động tốt trên mọi kích thước màn hình
- **Color Scheme**: Sử dụng purple theme nhất quán với ứng dụng
- **Animations**: Smooth transitions và hover effects
- **Icons**: React Icons (Feather Icons) cho UI đồng nhất

### Recipe Card
- Hiển thị hình ảnh món ăn
- Badge phân loại (breakfast/lunch/dinner/snack)
- Badge calories nổi bật
- Meta info: Thời gian nấu, khẩu phần
- Tags và difficulty badge
- Tóm tắt dinh dưỡng
- Menu actions (View/Edit/Delete)

### Empty State
- Hiển thị khi chưa có món ăn nào
- Call-to-action button để thêm món ăn đầu tiên

## 💾 Lưu Trữ Dữ Liệu

Dữ liệu được lưu trữ trong **localStorage** với key `myRecipes`:
- Tự động lưu khi thêm/sửa/xóa
- Persist qua các session
- Không cần backend API

## 🔗 Route

URL: `/my-recipes`

Constant: `ROUTES.MY_RECIPES`

## 🛠️ Các Component Được Tái Sử Dụng

1. **MainLayout** - Layout chính
2. **RecipeDetailModal** - Modal chi tiết món ăn (từ MenuSuggestionPage)
3. **LoadingSpinner** - Không cần vì dữ liệu local
4. **Theme & Styles** - Sử dụng theme colors và animation styles có sẵn

## 📱 Responsive Breakpoints

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

## ✅ Best Practices Đã Áp Dụng

1. **Clean Code**:
   - TypeScript strict typing
   - Proper component separation
   - Custom hooks for logic separation
   - Reusable components

2. **Performance**:
   - useMemo for filtered/sorted lists
   - useCallback for event handlers
   - Lazy evaluation

3. **UX**:
   - Toast notifications cho mọi action
   - Confirmation dialog cho delete
   - Loading states và error handling
   - Empty states

4. **Accessibility**:
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation support (via Chakra UI)

## 🚀 Cách Truy Cập

Người dùng có thể truy cập trang này bằng cách:
1. Navigate đến `/my-recipes` trực tiếp
2. Hoặc thêm link trong navigation menu/sidebar (nếu cần)

## 📝 Ghi Chú

- Tất cả dữ liệu được lưu local, không sync với backend
- Có thể mở rộng để tích hợp API backend trong tương lai
- Form validation đầy đủ để đảm bảo data quality
- Hỗ trợ multiple ingredients, instructions, và tags
