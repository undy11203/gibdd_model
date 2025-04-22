"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Добро пожаловать в систему ГИБДД</h1>
      <p>Здесь вы можете управлять данными о транспортных средствах, организациях, ДТП и техосмотрах.</p>
      <ul className="mt-4 space-y-2">
        <li><Link href="/vehicles" className="text-blue-500">Регистрация транспортных средств</Link></li>
        <li><Link href="/organizations" className="text-blue-500">Список организаций</Link></li>
        <li><Link href="/accidents" className="text-blue-500">Регистрация ДТП</Link></li>
        <li><Link href="/wanted" className="text-blue-500">Розыск угнанных ТС</Link></li>
        <li><Link href="/inspection" className="text-blue-500">Техосмотр</Link></li>
        <li><Link href="/license-plates" className="text-blue-500">Проверка номеров</Link></li>
        <li><Link href="/admin" className="text-blue-500">Администрирование</Link></li>
        <li><Link href="/sales" className="text-blue-500">Купля-продажа авто</Link></li>
        <li><Link href="/owner" className="text-blue-500">Водители</Link></li>
      </ul>
    </div>
  );
}