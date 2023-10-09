-- CreateTable
CREATE TABLE "pessoas" (
    "id" TEXT NOT NULL,
    "apelido" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "stack" TEXT[],

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_apelido_key" ON "pessoas"("apelido");
