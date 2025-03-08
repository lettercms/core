-- CreateTable
CREATE TABLE "VerificationCodes" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCodes_id_key" ON "VerificationCodes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCodes_email_key" ON "VerificationCodes"("email");
