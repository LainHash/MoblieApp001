export interface DishItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  priceFormatted: string;
  calories: string;
  category: string;
  badge?: string;
  rating: string;
  image: string;
  description: string;
  dietary?: string[];
  bunOptions?: { label: string; sub: string; extra: number }[];
  donenessOptions?: { label: string; note: string }[];
  addOns?: { name: string; price: number; priceFormatted: string }[];
}

export interface CartItem {
  id: string;
  dishId: string;
  name: string;
  customization: string;
  price: number;
  basePrice: number;
  quantity: number;
  image: string;
}

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  membershipTier: string;
  points: number;
  walletBalance: string;
  totalOrders: number;
  avatar: string;
  addresses: {
    id: string;
    label: string;
    detail: string;
    isDefault?: boolean;
  }[];
}

export const CURRENT_BRANCH = {
  name: 'Chi nhánh Trung tâm',
  distance: 'Cách 1.2 km',
  status: 'Mở cửa đến 23:00',
  prepTime: '~15-20 phút',
};

export const MOCK_USER: UserProfile = {
  name: 'Nguyễn Hoàng Minh',
  username: '@alexmorgan99',
  email: 'alex.morgan@email.com',
  phone: '+84 908 123 456',
  dob: '1995-10-24',
  gender: 'male',
  membershipTier: 'Thành viên Vàng (Gold Member)',
  points: 1250,
  walletBalance: '450.000 đ',
  totalOrders: 18,
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuASwdLjqoVI09P_HXzPnzLythOhTeD0QSIstrmGdXkhfL5BwZm-Hie9_K-NNNGKj3E8b0-m8yOWq1dmSHwUERu231oahCFV8QQ1UpCR7Ddk7JCGat7G0qpPs4VB-5ZESaZcKbVTFtumsWkJCSNdu7TotplhmTAPMh1jnnjBGe4FkFdMiVD-_TQLQEkdiZ4fS5dEFGLO1-tU-Y-jMZFf9-LhtdVegDh_PHPInBZQSMhsV2W5nFRLqlboPA',
  addresses: [
    {
      id: 'addr-1',
      label: 'Văn phòng Landmark 81',
      detail: '720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP.HCM',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Căn hộ Masteri Thảo Điền',
      detail: 'Tháp T4, 159 Xa Lộ Hà Nội, Thảo Điền, TP. Thủ Đức',
    },
  ],
};

export const CATEGORIES = [
  'Tất cả',
  'Món Bếp trưởng',
  'Pizza nướng củi',
  'Burger',
  'Mì Ý thủ công',
  'Tô dinh dưỡng',
  'Đồ uống',
];

export const DISHES: DishItem[] = [
  {
    id: 'dish-1',
    name: 'Burger Bò Wagyu Nấm Truffle',
    subtitle: 'Bánh Brioche, phô mai Pecorino nấm Truffle',
    price: 285000,
    priceFormatted: '285.000 đ',
    calories: '820 kcal',
    category: 'Burger',
    badge: 'Bếp trưởng chọn ★ 4.9',
    rating: '★ 4.9 (240 đánh giá)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAps8wF9nU1851O5HnO3A_8R7cf4_kJ7qkh8gYALGJ7MrHceeU83ErCy5RtAUoufksPay-PDAupQ5UuDD8scPKSmQavB4u-IJ-m6b04B0XUwmKX_WQ-mgR8eiXVDPrgfveF7JeNGKEtGWHAUxiM9B9o3l7f7DLiZJ54v7leXyBc3N4WBN8n65NP-TzYxXEEXVWmGh4e3wu_-JMDyqAz1_DAlcQnGDY-EjvGnWEJUf2nUwHKHx8Pu4SmDQ',
    description:
      'Hai lớp thịt bò Wagyu Úc nướng xém cạnh, sốt kem nấm truffle đen và phô mai Pecorino, mứt hành tây caramen, lá rocket hữu cơ cùng sốt tỏi hun khói trên vỏ bánh brioche bơ sữa thơm lừng.',
    dietary: ['100% Thịt bò Wagyu Úc', 'Chứng nhận Halal'],
    bunOptions: [
      { label: 'Bánh mì hoa cúc Brioche', sub: 'Mềm xốp, phủ lớp bơ vàng óng thơm ngậy', extra: 0 },
      { label: 'Bánh mì ngũ cốc nguyên cám', sub: 'Giàu chất xơ, vị hạt mộc mạc', extra: 20000 },
      { label: 'Bánh mì không chứa Gluten', sub: 'Công thức riêng chuẩn dinh dưỡng', extra: 30000 },
    ],
    donenessOptions: [
      { label: 'Tái vừa (Medium Rare)', note: 'Bếp trưởng khuyên dùng • Thịt hồng mọng nước' },
      { label: 'Chín vừa (Medium)', note: 'Độ mềm ngọt cân bằng • Hồng nhẹ trung tâm' },
      { label: 'Chín kỹ (Medium Well)', note: 'Thơm đậm đà • Viền xém vàng' },
    ],
    addOns: [
      { name: 'Thêm sốt nấm Truffle phô mai Pecorino', price: 45000, priceFormatted: '+45.000 đ' },
      { name: 'Thịt ba chỉ heo Pancetta giòn rụm', price: 55000, priceFormatted: '+55.000 đ' },
      { name: 'Trứng gà ta lòng đào hữu cơ', price: 25000, priceFormatted: '+25.000 đ' },
    ],
  },
  {
    id: 'dish-2',
    name: 'Pizza Burrata Caprese Lò Củi',
    subtitle: 'Cà chua San Marzano, lá húng quế, giấm Modena',
    price: 260000,
    priceFormatted: '260.000 đ',
    calories: '710 kcal',
    category: 'Pizza nướng củi',
    badge: 'Món thủ công',
    rating: '★ 4.8 (185 đánh giá)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCNSCrSH_LJGqWfJne7qHc4dIm23ld1F80uhdNq-_R3pOjr1fjYufUwqFOsp88cHj1vyJaZuvl-7rmJfwIL_XaBcUc-rTRS49PT0tWk2H55PQM9drV_nhxWuEm5XMlQ1bSH-9h2ypt1H2ZTtEI05APZkeNSSuen5RzMz_YQUAXy2__emizgUcRU2TKpDAmO0ZdmkGqBDmwFpgL83e2ww3hFtevifbKrDDIAclH25WzIiR4D6SiUalCz6A',
    description:
      'Đế bánh nhào thủ công lên men chậm, nướng lò củi 90 giây ở nhiệt độ 450°C, phủ phô mai Burrata tươi nguyên quả béo ngậy, cà chua bi heirloom và giấm đen Modena ủ lâu năm.',
    dietary: ['Món chay (Vegetarian)', 'Nướng lò củi 90 giây'],
  },
  {
    id: 'dish-3',
    name: 'Cà Phê Cold Brew Matcha Yuzu',
    subtitle: 'Matcha Uji thượng hạng, quýt Yuzu Nhật Bản',
    price: 85000,
    priceFormatted: '85.000 đ',
    calories: '120 kcal',
    category: 'Đồ uống',
    badge: 'Pha lạnh thủ công',
    rating: '★ 4.9 (98 đánh giá)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4h1NzQ7VrsV8UPxtvd-D67b4MJz3S1fWp4Kstu5-dMWh7_5NX4hGkj-a8O7Z2oclQoBvaOCfGX1sTnayciO0HZCmoQuKoONRoH5NiagqKWL0uFZkTSpD2F7Zukt6ISx_yk8Aer_FQdia4r23gyktyIVSpgVg83guIxxgbSpR2BvLEwH9x6b3BFySku_ts8PMTZWoIetHAAHOgT7BwjylbjwKECabVEIf2INgmnLoNR0AgXdrbQd1WVQ',
    description:
      'Thức uống thủ công hai tầng độc đáo với lớp matcha Uji tươi xanh nổi trên nền nước ép quýt Yuzu sủi bọt thanh mát và đá tinh khiết.',
    dietary: ['Thuần chay (Vegan)', 'Ít calo'],
  },
  {
    id: 'dish-4',
    name: 'Bánh Tart Dung Nham Socola Valrhona',
    subtitle: 'Socola đắng 70%, kem vani Madagascar',
    price: 135000,
    priceFormatted: '135.000 đ',
    calories: '480 kcal',
    category: 'Món Bếp trưởng',
    badge: 'Tráng miệng',
    rating: '★ 4.9 (142 đánh giá)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBpybkMVuGXYxXjPe-zMMwU08-07dKpM125QQBQJz2FEIjb2RVC62AN5i0Cb8-F3QtmDE37DMvwMDiP1UTQkzUwh54SgxE6R47qcLrtlMAOOK70l9_Mmb83K75DHZC6fRN5CaFEz7q0rAWXnwriy42f5OkczEJKUEECW11SceXUXLEETwCJkNHEswKP6zlENtm63KTNwr2awOwETDVdLsnESJXEsfUJycqfNKPXtaLD0MeyYqhCQs7WnQ',
    description:
      'Bánh tart socola đen Pháp Valrhona 70% với nhân sốt ganache ấm nóng tan chảy, chút muối biển Maldon giòn rụm ăn kèm kem que vani đảo Madagascar thơm ngát.',
    dietary: ['Món chay ngọt', 'Socola Pháp 70%'],
  },
  {
    id: 'dish-5',
    name: 'Mì Ý Fettuccine Nấm Truffle & Porcini',
    subtitle: 'Mì trứng cán tay, nấm Porcini rừng',
    price: 250000,
    priceFormatted: '250.000 đ',
    calories: '680 kcal',
    category: 'Mì Ý thủ công',
    badge: 'Món thủ công',
    rating: '★ 4.8 (112 đánh giá)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCzfEUD125HvRZXlwnQa1sBWcalJdsr2hROnvEwEE5GVGx-q4h1-zLFRTI0KwkGtQGIF-SR4JYckwkN8_YOaX0crKcjSmOCLA1VvE3aCu1nw4F0pGPb3OQXpitbr-yqj9pl21GnLJMFU-FOnsV81pfkruLNo8Rp9jaS9opagXvb1NH9ZS-9FsxBqlAG3pZJk0xcmgQezZ_mLQJhKg2Tj4NH6MvWHrAx0kV7PNsy2tUbn9MEK_-MUwad8w',
    description:
      'Sợi mì Fettuccine trứng tươi làm thủ công hàng ngày hòa quyện cùng bơ lạt Normandy béo ngậy, nấm thông Porcini rừng và những lát nấm truffle đen thượng hạng bào mỏng.',
    dietary: ['Mì tươi cán tay', 'Nguyên liệu cao cấp'],
  },
  {
    id: 'dish-6',
    name: 'Burger Thăn Bò Ribeye Nấm Truffle',
    subtitle: 'Phô mai Gruyère, hành caramen đậm vị',
    price: 295000,
    priceFormatted: '295.000 đ',
    calories: '820 kcal',
    category: 'Burger',
    badge: 'Bán chạy nhất',
    rating: '★ 4.9 (310 đánh giá)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBM-0RJ9JCWMNtrpcGC2NYBhEzPGjtDJEgqkYO-_kWhUE6bTuEx0tbvQGn31GM1tIs_O-fX7EoBMEim6SY1_-MVixLW6NcqrqLMh7x7gRbTeyiNBmhNTo4SpyzaYZPuiDnQVewEuHMoK5mwtcJChDRqpIjN4Q4ROeVuWrct8HkMz3-DdiRYV6BJ4OtTDTBgI4DU_44Gqbk5b85Q9xFoRdCmfcI9GGYFHpbQ1wsscXwpLEsqUmFSl77qOQ',
    description:
      'Bánh burger đẳng cấp với nhân thịt thăn bò Ribeye xay mịn nướng lửa than, phô mai Thụy Sĩ Gruyère tan chảy, hành tây om thơm dẻo và sốt mayonnaise nấm truffle.',
    dietary: ['Bò Ribeye hảo hạng', 'Món gợi ý'],
  },
];

export const MOCK_CART: CartItem[] = [
  {
    id: 'cart-1',
    dishId: 'dish-1',
    name: 'Burger Bò Wagyu Nấm Truffle',
    customization: 'Bánh Brioche, Thêm phô mai Pecorino nấm Truffle',
    basePrice: 285000,
    price: 330000,
    quantity: 1,
    image: DISHES[0].image,
  },
  {
    id: 'cart-2',
    dishId: 'dish-2',
    name: 'Pizza Burrata Caprese Lò Củi',
    customization: 'Cà chua San Marzano, Húng quế, Giấm Modena',
    basePrice: 260000,
    price: 260000,
    quantity: 1,
    image: DISHES[1].image,
  },
  {
    id: 'cart-3',
    dishId: 'dish-3',
    name: 'Cà Phê Cold Brew Matcha Yuzu',
    customization: 'Ít đá, Sữa hạnh nhân',
    basePrice: 85000,
    price: 85000,
    quantity: 2,
    image: DISHES[2].image,
  },
];

export const MOCK_ORDERS = [
  {
    id: 'AK-8921',
    date: 'Hôm nay, 12:45',
    status: 'Đang chuẩn bị (Dự kiến 15 phút)',
    statusColor: '#ad2c00',
    branch: 'Chi nhánh Trung tâm',
    items: [
      { name: 'Burger Bò Wagyu Nấm Truffle', qty: 1, price: '330.000 đ' },
      { name: 'Cà Phê Cold Brew Matcha Yuzu', qty: 1, price: '85.000 đ' },
    ],
    total: '415.000 đ',
  },
  {
    id: 'AK-8874',
    date: 'Hôm qua, 19:20',
    status: 'Hoàn tất',
    statusColor: '#006947',
    branch: 'Chi nhánh Trung tâm',
    items: [
      { name: 'Pizza Burrata Caprese Lò Củi', qty: 2, price: '520.000 đ' },
      { name: 'Bánh Tart Dung Nham Socola Valrhona', qty: 1, price: '135.000 đ' },
    ],
    total: '655.000 đ',
  },
  {
    id: 'AK-8740',
    date: '28/09/2026',
    status: 'Hoàn tất',
    statusColor: '#006947',
    branch: 'Chi nhánh Trung tâm',
    items: [
      { name: 'Mì Ý Fettuccine Nấm Truffle & Porcini', qty: 1, price: '250.000 đ' },
      { name: 'Cà Phê Cold Brew Matcha Yuzu', qty: 1, price: '85.000 đ' },
    ],
    total: '335.000 đ',
  },
];
