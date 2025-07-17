####################################
########### VARIABLES ##############
####################################
GCP_PROJECT="klarnact"
SERVICE_NAME="demo-app"
REGION="europe-west1"

####################################
###### GENERATED VARIABLES #########
####################################
VERSION="$(yarn run env | grep npm_package_version | sed 's/"npm_package_version": "//g' | sed 's/",//g' | sed 's/ //g')"
IMAGE_NAME="eu.gcr.io/$GCP_PROJECT/$SERVICE_NAME"
IMAGE_NAME_VERSION="$IMAGE_NAME:$VERSION"
IMAGE_NAME_LATEST="$IMAGE_NAME:latest"

####################################
############# BUILD ################
####################################
echo "Create Docker image '$IMAGE_NAME_VERSION' via local docker ..."
docker build -t $IMAGE_NAME_VERSION .   

# ####################################
# ############ TAGGING ###############
# ####################################
echo "Add tags '$IMAGE_NAME_LATEST' and '$IMAGE_NAME_VERSION' to docker image..."
docker tag $IMAGE_NAME_VERSION $IMAGE_NAME_LATEST

# ####################################
# ########### PUSH IMAGE #############
# ####################################
echo "Push image '$IMAGE_NAME_VERSION' Google Cloud Registry..."
docker push $IMAGE_NAME_VERSION

####################################
########### DEPLOYMENT #############
####################################
echo "Deploying Cloud Run Service '$SERVICE_NAME' to '$GCP_PROJECT' in '$REGION'  🚀 🍀"
gcloud run deploy $SERVICE_NAME \
  --image "$IMAGE_NAME_VERSION" \
  --project $GCP_PROJECT \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated