-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255),
    "profile_name" VARCHAR(255),
    "mobileNo" VARCHAR(20) NOT NULL,
    "referral_code" VARCHAR(20) DEFAULT 'DialUrbano',
    "referred_by" VARCHAR(20) DEFAULT 'DialUrbano',
    "otp" VARCHAR(6) NOT NULL,
    "failed_attempts" INTEGER DEFAULT 0,
    "is_email_verified" BOOLEAN DEFAULT false,
    "is_locked" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_mobile_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNo_key" ON "User"("mobileNo");
