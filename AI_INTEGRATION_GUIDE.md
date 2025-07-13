# دليل دمج الذكاء الاصطناعي في نظام إدارة الكراجات الذكي

## نظرة عامة

هذا المشروع يوفر إطار عمل كامل لنظام إدارة الكراجات الذكي باستخدام تقنيات الويب الحديثة. يمكن دمج الذكاء الاصطناعي للكشف عن المركبات بعدة طرق.

## الطرق المتاحة لدمج الذكاء الاصطناعي

### 1. TensorFlow.js (الأسهل للبداية)

```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-backend-webgl
```

```javascript
import * as tf from '@tensorflow/tfjs';

// تحميل مودل YOLO محول لـ TensorFlow.js
const model = await tf.loadLayersModel('/models/yolo-vehicle-detection.json');

// معالجة الإطار
const detectVehicles = async (imageElement) => {
  const tensor = tf.browser.fromPixels(imageElement);
  const resized = tf.image.resizeBilinear(tensor, [416, 416]);
  const normalized = resized.div(255.0);
  const batched = normalized.expandDims(0);
  
  const predictions = await model.predict(batched);
  return processPredictions(predictions);
};
```

### 2. ONNX.js (أداء أفضل)

```bash
npm install onnxjs
```

```javascript
import { InferenceSession, Tensor } from 'onnxjs';

// تحميل مودل ONNX
const session = new InferenceSession();
await session.loadModel('/models/yolo-vehicle-detection.onnx');

// تشغيل الاستنتاج
const runInference = async (inputData) => {
  const inputTensor = new Tensor(inputData, 'float32', [1, 3, 416, 416]);
  const outputMap = await session.run([inputTensor]);
  return outputMap;
};
```

### 3. MediaPipe (من Google)

```bash
npm install @mediapipe/tasks-vision
```

```javascript
import { ObjectDetector, FilesetResolver } from '@mediapipe/tasks-vision';

// إعداد MediaPipe
const vision = await FilesetResolver.forVisionTasks();
const objectDetector = await ObjectDetector.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: '/models/efficientdet_lite0.tflite',
    delegate: 'GPU'
  },
  scoreThreshold: 0.5,
  runningMode: 'VIDEO'
});

// كشف الكائنات
const detectObjects = (videoElement) => {
  const detections = objectDetector.detectForVideo(videoElement, Date.now());
  return filterVehicles(detections);
};
```

### 4. OpenCV.js + WebAssembly (أداء عالي)

```bash
npm install opencv-js
```

```javascript
import cv from 'opencv-js';

// معالجة الصورة باستخدام OpenCV
const preprocessImage = (imageElement) => {
  const src = cv.imread(imageElement);
  const dst = new cv.Mat();
  
  // تغيير الحجم والتطبيع
  cv.resize(src, dst, new cv.Size(416, 416));
  cv.convertScaleAbs(dst, dst, 1/255.0, 0);
  
  return dst;
};
```

## تحويل مودل Python إلى الويب

### 1. تحويل PyTorch إلى ONNX

```python
import torch
import torch.onnx

# تحميل المودل
model = torch.load('best.pt')
model.eval()

# تحويل إلى ONNX
dummy_input = torch.randn(1, 3, 416, 416)
torch.onnx.export(
    model,
    dummy_input,
    "yolo-vehicle-detection.onnx",
    export_params=True,
    opset_version=11,
    do_constant_folding=True,
    input_names=['input'],
    output_names=['output']
)
```

### 2. تحويل إلى TensorFlow.js

```python
import tensorflowjs as tfjs

# تحويل من ONNX أو PyTorch
tfjs.converters.convert_onnx_model(
    "yolo-vehicle-detection.onnx",
    "./tfjs-model"
)
```

## دمج الكشف في النظام

### تحديث مكون AIVehicleDetection

```typescript
// في src/components/smart-garage/AIVehicleDetection.tsx

import * as tf from '@tensorflow/tfjs';

export function AIVehicleDetection() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  // تحميل المودل
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('/models/model.json');
        setModel(loadedModel);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Failed to load model:', error);
      }
    };
    
    loadModel();
  }, []);

  // كشف المركبات الحقيقي
  const detectVehiclesReal = async (videoElement: HTMLVideoElement) => {
    if (!model) return [];

    try {
      // تحويل الفيديو إلى tensor
      const tensor = tf.browser.fromPixels(videoElement);
      const resized = tf.image.resizeBilinear(tensor, [416, 416]);
      const normalized = resized.div(255.0);
      const batched = normalized.expandDims(0);

      // تشغيل الاستنتاج
      const predictions = await model.predict(batched) as tf.Tensor;
      const data = await predictions.data();

      // معالجة النتائج
      const vehicles = processYOLOOutput(data, 416, 416);
      
      // تنظيف الذاكرة
      tensor.dispose();
      resized.dispose();
      normalized.dispose();
      batched.dispose();
      predictions.dispose();

      return vehicles;
    } catch (error) {
      console.error('Detection error:', error);
      return [];
    }
  };

  // معالجة نتائج YOLO
  const processYOLOOutput = (data: Float32Array, width: number, height: number) => {
    const vehicles: DetectedVehicle[] = [];
    const numBoxes = data.length / 85; // 85 = 4 coords + 1 confidence + 80 classes

    for (let i = 0; i < numBoxes; i++) {
      const offset = i * 85;
      const confidence = data[offset + 4];

      if (confidence > 0.5) {
        const centerX = data[offset] * width;
        const centerY = data[offset + 1] * height;
        const boxWidth = data[offset + 2] * width;
        const boxHeight = data[offset + 3] * height;

        // تحديد نوع المركبة (classes 2, 3, 5, 7 للمركبات)
        let maxClassScore = 0;
        let vehicleClass = -1;
        
        for (let j = 5; j < 85; j++) {
          if ([2, 3, 5, 7].includes(j - 5) && data[offset + j] > maxClassScore) {
            maxClassScore = data[offset + j];
            vehicleClass = j - 5;
          }
        }

        if (vehicleClass !== -1) {
          const vehicleType = getVehicleType(vehicleClass);
          const seats = getSeatsForType(vehicleType);

          vehicles.push({
            id: `vehicle_${Date.now()}_${i}`,
            type: vehicleType,
            confidence: confidence * maxClassScore,
            bbox: [
              centerX - boxWidth / 2,
              centerY - boxHeight / 2,
              boxWidth,
              boxHeight
            ],
            seats,
            timestamp: Date.now()
          });
        }
      }
    }

    return vehicles;
  };

  // تحديد نوع المركبة حسب كلاس YOLO
  const getVehicleType = (classId: number): VehicleType => {
    const mapping = {
      2: 'small-car',    // car
      3: 'minivan',      // motorcycle -> treated as minivan
      5: 'fullbus',      // bus
      7: 'suv'           // truck -> treated as SUV
    };
    return mapping[classId as keyof typeof mapping] || 'small-car';
  };

  const getSeatsForType = (type: VehicleType): number => {
    const seats = {
      'small-car': 4,
      'suv': 7,
      'minivan': 15,
      'fullbus': 45
    };
    return seats[type];
  };

  // باقي الكود...
}
```

## إعدادات الأداء

### 1. تسريع GPU

```javascript
// تفعيل WebGL backend
import '@tensorflow/tfjs-backend-webgl';
await tf.setBackend('webgl');

// أو WebGPU للأداء الأفضل
import '@tensorflow/tfjs-backend-webgpu';
await tf.setBackend('webgpu');
```

### 2. Web Workers للمعالجة

```javascript
// worker.js
import * as tf from '@tensorflow/tfjs';

let model = null;

self.onmessage = async (e) => {
  const { imageData, modelUrl } = e.data;
  
  if (!model) {
    model = await tf.loadLayersModel(modelUrl);
  }
  
  const tensor = tf.browser.fromPixels(imageData);
  const predictions = await model.predict(tensor);
  
  self.postMessage({
    predictions: await predictions.data(),
    shape: predictions.shape
  });
};
```

### 3. تحسين الذاكرة

```javascript
// تنظيف دوري للذاكرة
useEffect(() => {
  const cleanup = setInterval(() => {
    tf.disposeVariables();
    if (tf.memory().numTensors > 1000) {
      console.warn('Memory cleanup needed');
    }
  }, 10000);

  return () => clearInterval(cleanup);
}, []);
```

## نماذج AI موصى بها

### 1. YOLOv8 (الأفضل للدقة)
- دقة عالية في كشف المركبات
- سرعة جيدة
- دعم لـ ONNX و TensorFlow.js

### 2. MobileNet + SSD (الأسرع)
- محسن للأجهزة المحمولة
- استهلاك ذاكرة قليل
- سرعة عالية

### 3. EfficientDet (متوازن)
- توازن بين الدقة والسرعة
- دعم MediaPipe
- جودة عالية

## خطوات التطبيق

1. **اختر المودل المناسب** حسب احتياجاتك
2. **حول المودل** إلى صيغة الويب
3. **ادمج الكود** في مكون AIVehicleDetection
4. **اختبر الأداء** وحسن حسب الحاجة
5. **فعل GPU acceleration** للسرعة
6. **أضف Web Workers** للمعالجة المتوازية

## مثال كامل للتشغيل

```typescript
// استخدام النظام مع AI حقيقي
const SmartGarageWithAI = () => {
  const [vehicles, setVehicles] = useState<DetectedVehicle[]>([]);
  const [trafficCount, setTrafficCount] = useState({ incoming: 0, outgoing: 0 });

  return (
    <div>
      <AIVehicleDetection
        onVehicleDetected={(vehicle) => {
          setVehicles(prev => [...prev, vehicle]);
        }}
        onTrafficCount={(incoming, outgoing) => {
          setTrafficCount({ incoming, outgoing });
        }}
      />
      
      <SmartGarageDashboard 
        detectedVehicles={vehicles}
        trafficData={trafficCount}
      />
    </div>
  );
};
```

## النتيجة المتوقعة

بعد دمج الذكاء الاصطناعي، ستحصل على:

- ✅ كشف مركبات مباشر من الكاميرا
- ✅ تصنيف أنواع المركبات (سيارة، SUV، باص، إلخ)
- ✅ حساب المقاعد المتاحة تلقائياً
- ✅ تتبع حركة الدخول والخروج
- ✅ إحصائيات مباشرة ودقيقة
- ✅ أداء عالي في المتصفح

## الدعم والمساعدة

لأي استفسارات حول التطبيق أو دمج الذكاء الاصطناعي، يمكن الرجوع إلى:

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [ONNX.js GitHub](https://github.com/microsoft/onnxjs)
- [MediaPipe Solutions](https://developers.google.com/mediapipe)
- [OpenCV.js Tutorials](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)