-- CreateTable
CREATE TABLE "restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "hallal" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "time" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "restaurantId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "paymentLog" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "reverseState" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "UserId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cart" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "menuItemsId" TEXT NOT NULL,
    "PaymentLogId" TEXT NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("menuItemsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "menuItem_id_key" ON "menuItem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "paymentLog_id_key" ON "paymentLog"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_id_key" ON "cart"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_PaymentLogId_key" ON "cart"("PaymentLogId");

-- AddForeignKey
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menuItem" ADD CONSTRAINT "menuItem_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentLog" ADD CONSTRAINT "paymentLog_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_menuItemsId_fkey" FOREIGN KEY ("menuItemsId") REFERENCES "menuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_PaymentLogId_fkey" FOREIGN KEY ("PaymentLogId") REFERENCES "paymentLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
