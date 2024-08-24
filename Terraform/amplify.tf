resource "aws_amplify_app" "example" {
  name        = "frontendBooks"
  repository  = "https://github.com/Marouankl/projetcloud"
  oauth_token = "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"  # Replace with your GitHub token

  build_spec = jsonencode({
    version      = 1
    applications = [
      {
        appRoot = "."  # The project is in the root directory of the repository
        frontend = {
          phases = {
            preBuild = {
              commands = [
                "npm install",  # Install all dependencies, including devDependencies
              ]
            }
            build = {
              commands = [
                "npm run build"  # Command to build the frontend
              ]
            }
          }
          artifacts = {
            baseDirectory = "dist"  # Ensure this is correct for your build output
            files         = [
              "**/*"
            ]
          }
          cache = {
            paths = [
              "node_modules/**/*"  # Cache the Node.js modules
            ]
          }
        }
      }
    ]
  })

  environment_variables = {
    REACT_APP_API_URL = "https://8sddxq83tf.execute-api.us-east-1.amazonaws.com/prod"  # Your API Gateway URL
  }

  iam_service_role_arn = "arn:aws:iam::452682096005:role/lamdaRole"  # ARN of the IAM role for Amplify
}
