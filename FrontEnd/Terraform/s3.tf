# Déclaration du bucket S3
resource "aws_s3_bucket" "book_images" {
  bucket = var.s3_bucket_name

  # Versioning des objets dans le bucket
  versioning {
    enabled = true
  }

  tags = {
    Name = "book-images"
  }
}

# Configuration du versioning pour le bucket S3
resource "aws_s3_bucket_versioning" "book_images_versioning" {
  bucket = aws_s3_bucket.book_images.id

  versioning_configuration {
    status = "Enabled"  # Utilisez 'Enabled' pour activer le versionning
  }
}

