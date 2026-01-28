
import { Product } from '../types';

export const products: Product[] = [
  // --- Кондиционеры и климатическая техника ---
  {
    id: 'p_ballu_01',
    sku: 'BALLU-BSPR07HN1',
    brand: 'BALLU',
    status: 'active',
    name: 'Кондиционер BALLU BSPR07HN1',
    price: 45000,
    costPrice: 32000,
    maxDiscount: 10,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Настенная сплит-система серии BSPR. Надежное решение для вашего комфорта в помещениях до 20 кв.м.',
    categoryId: 'cat5',
    image: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800',
    images: ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800'],
    rating: 5,
    features: ['Авторестарт', 'Турбо режим', 'Самоочистка'],
    attributes: [
      { label: 'Артикул', value: 'BSPR07HN1' },
      { label: 'Площадь', value: 'до 20 м²' },
      { label: 'Мощность', value: '7000 BTU' },
      { label: 'Режимы', value: 'Холод / Тепло' },
      { label: 'Хладагент', value: 'R410A' },
      { label: 'Уровень шума', value: '23 дБ' }
    ],
    stock: 15
  },
  {
    id: 'p_ballu_02',
    sku: 'BALLU-BSPR09HN1',
    brand: 'BALLU',
    status: 'active',
    name: 'Кондиционер BALLU BSPR09HN1',
    price: 48000,
    costPrice: 35000,
    maxDiscount: 5,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Производительный кондиционер для помещений до 25 кв.м.',
    categoryId: 'cat5',
    image: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800',
    images: ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800'],
    rating: 5,
    features: ['Инвертор', 'Тихий режим'],
    attributes: [
      { label: 'Площадь', value: 'до 25 м²' },
      { label: 'Мощность', value: '9000 BTU' },
      { label: 'Класс энергоэффективности', value: 'A++' }
    ],
    stock: 8
  },
  // --- Ноутбуки ---
  {
    id: 'p_laptop_01',
    sku: 'NS-LAP-512',
    brand: 'SANCTY',
    status: 'active',
    name: 'Ноутбук 15.6 дюймов для работы и игр 16 + 512ГБ',
    price: 94720,
    oldPrice: 146998,
    costPrice: 65000,
    maxDiscount: 35,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Разблокировка по отпечатку пальца, работает быстро и безопасно. Компактный и мощный помощник.',
    categoryId: 'cat1',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
    ],
    rating: 4.5,
    features: ['Windows 10', 'Сканер отпечатка', 'Full HD экран'],
    attributes: [
      { label: 'Оперативная память', value: '16 ГБ DDR4' },
      { label: 'Объем SSD', value: '512 ГБ M.2' },
      { label: 'Процессор', value: 'Intel Pentium' },
      { label: 'Диагональ экрана', value: '15.6"' },
      { label: 'Разрешение', value: '1920x1080' },
      { label: 'Вес', value: '1.7 кг' }
    ],
    stock: 24,
    reviews: [
      { id: 'r1', productId: 'p_laptop_01', productName: 'Ноутбук SANCTY', reviewerName: 'Марк', rating: 5, comment: 'За свои деньги это лучший выбор. Очень шустрый.', date: '12 марта', status: 'approved', verified: true }
    ]
  },
  {
    id: 'p1',
    sku: 'NS-P1',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Наушники Aero Pro',
    price: 349.99,
    costPrice: 200,
    maxDiscount: 15,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Окунитесь в чистый звук с активным шумоподавлением и 40 часами автономной работы.',
    categoryId: 'cat1',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    features: ['Шумоподавление', 'Bluetooth 5.2', 'Пространственный звук'],
    attributes: [
      { label: 'Тип', value: 'Полноразмерные' },
      { label: 'Bluetooth', value: '5.2' },
      { label: 'Автономность', value: '40 часов' },
      { label: 'Разъем зарядки', value: 'Type-C' }
    ],
    stock: 12
  }
];
