# API для работы с просмотрами товаров

## Примеры использования

### 1. Добавить просмотр товара
```http
POST /products/view/1
Authorization: Bearer <token> (опционально)
```

### 2. Получить популярные товары
```http
GET /products/popular/list?limit=10&timeRange=week
```

Параметры:
- `limit` - количество товаров (по умолчанию 10)
- `timeRange` - период: 'day', 'week', 'month', 'all' (по умолчанию 'all')

### 3. Получить недавно просмотренные товары (требует авторизации)
```http
GET /products/recently-viewed/list?limit=10
Authorization: Bearer <token>
```

### 4. Получить количество просмотров товара
```http
GET /products/views-count/1
```

### 5. Получить товар (автоматически добавляет просмотр)
```http
GET /products/1
Authorization: Bearer <token> (опционально)
```

## Ответы API

### Популярные товары
```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "slug": "iphone-15",
    "price": 999,
    "images": ["image1.jpg"],
    "category": {...},
    "viewsCount": 156
  }
]
```

### Недавно просмотренные
```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "slug": "iphone-15",
    "price": 999,
    "images": ["image1.jpg"],
    "category": {...},
    "viewedAt": "2025-07-10T12:00:00Z"
  }
]
```

### Количество просмотров
```json
{
  "productId": 1,
  "viewsCount": 156
}
```

## Особенности реализации

1. **Дедупликация просмотров**: Если пользователь авторизован, повторные просмотры одного товара засчитываются только через час
2. **Автоматический учет**: При получении товара через GET /products/:id автоматически добавляется просмотр
3. **Анонимные просмотры**: Неавторизованные пользователи тоже могут добавлять просмотры
4. **Популярность по периодам**: Можно получить популярные товары за день, неделю, месяц или все время
