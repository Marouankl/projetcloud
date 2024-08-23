resource "aws_dynamodb_table" "books_table" {
  name         = var.dynamodb_table_name
  billing_mode    = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }


  attribute {
    name = "title"
    type = "S"
  }

  attribute {
    name = "author"
    type = "S"
  }

  attribute {
    name = "description"
    type = "S"
  }

  attribute {
    name = "price"
    type = "N"  
  }

  attribute {
    name = "image_url"
    type = "S"
  }

  # Index secondaire global pour le titre
  global_secondary_index {
    name            = "TitleIndex"
    hash_key        = "title"
    projection_type = "ALL"
 
  }

  # Index secondaire global pour l'auteur
  global_secondary_index {
    name            = "AuthorIndex"
    hash_key        = "author"
    projection_type = "ALL"

  }

  # Index secondaire global pour le prix
  global_secondary_index {
    name            = "PriceIndex"
    hash_key        = "price"
    projection_type = "ALL"
   
  }

  # Index secondaire global pour la description
  global_secondary_index {
    name            = "DescriptionIndex"
    hash_key        = "description"
    projection_type = "ALL"
  
  }

  # Index secondaire global pour l'URL de l'image
  global_secondary_index {
    name            = "ImageUrlIndex"
    hash_key        = "image_url"
    projection_type = "ALL"
   
  }
}
