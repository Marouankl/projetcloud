resource "aws_amplify_app" "example" {
  name        = "frontendBooks"
  repository  = "https://github.com/Marouankl/ProjetAws"
  oauth_token = "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"  # Replace with your GitHub token

  build_spec = jsonencode({
    version      = 1
    applications = [
      {
        appRoot = "FrontEnd"  # Specify the root directory of the application
        frontend = {
          phases = {
            preBuild = {
              commands = [
                "npm install",  # Install all dependencies, including devDependencies
                "export PATH=$(npm bin):$PATH"  # Ensure local node_modules binaries are in the PATH
              ]
            }
            build = {
              commands = [
                "npm run build"  # Command to build the frontend
              ]
            }
          }
          artifacts = {
            baseDirectory = "FrontEnd/dist"  # Directory where build artifacts are located
            files         = [
              "**/*"
            ]
          }
          cache = {
            paths = [
              "FrontEnd/node_modules/**/*"  # Cache the Node.js modules
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
