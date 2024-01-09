# ReactEczemaVision

## Screenshots

![Image 2](https://i.ibb.co/SvrNVdj/1-1.jpg)
![Image 3](https://i.ibb.co/PNpcTJW/1-2.jpg)
![Image 4](https://i.ibb.co/xsrD94T/1-3.jpg)
![Image 1](https://i.ibb.co/TRFvGLK/1-1.png)

## Setup for Python:

1. Install Python ([Setup instructions](https://wiki.python.org/moin/BeginnersGuide))

2. Install Python packages

```
pip3 install -r FastAPI/requirements.txt
```

3. Install Tensorflow Serving ([Setup instructions](https://www.tensorflow.org/tfx/serving/setup))

## Setup for ReactNative

1. Install Nodejs ([Setup instructions](https://nodejs.org/en/download/package-manager/))
2. Install NPM ([Setup instructions](https://www.npmjs.com/get-npm))
3. Install dependencies

```bash
cd EczemaScan-App
npm install -g yarn
yarn install
```
## Training the Model

1. Download our dataset from [Google Drive](https://drive.google.com/file/d/1ucC0_5Fx0XumeF0uUB3ef6h5w_b_gKrR/view?usp=sharing).
2. Only keep folders related to Skin.
3. Run Google Colab in Browser.
4. Open `Eczema_detection.ipynb` in google colab.
5. In cell #2, update the path to dataset.
6. Run all the Cells one by one.
7. Copy the model generated and save it with the version number in the `models` folder.

## Running the API

### Using FastAPI

1. Get inside `Fast-api` folder
```bash
cd Fast-api
```
2. Run the FastAPI Server using uvicorn
```bash
uvicorn main:app --reload --host 0.0.0.0
```
3. Your API is now running at `0.0.0.0:8000`

### Using FastAPI & TF Serve

1. Get inside `api` folder

```bash
cd api
```

2. Copy the `models.config.example` as `models.config` and update the paths in file.
3. Run the TF Serve (Update config file path below)

```bash
docker run -t --rm -p 8501:8501 -v --rest_api_port=8501 
```

4. Run the FastAPI Server using uvicorn
   For this you can directly run it from your server.py  using pycharm or vscode run option
   OR you can run it from command prompt as shown below,

```bash
uvicorn main:app --reload --host 0.0.0.0
```

5. Your API is now running at `0.0.0.0:8000`

## Running the App

1. Get inside `EczemaScan-App` folder

```bash
cd EczemaScan-App
```

2. Copy the URL from python server update `URL` to Src/scene/follow/follow.js URL if needed.

3. Run the app (android/iOS)

```bash
npx expo start
```

4. Creating public ([signed APK](https://reactnative.dev/docs/signed-apk-android))
