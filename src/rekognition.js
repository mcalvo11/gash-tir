import { Amplify, Auth, Storage } from 'aws-amplify';
import { RekognitionClient, DetectTextCommand } from '@aws-sdk/client-rekognition';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

async function createRekognitionClient() {
    const credentials = await Auth.currentCredentials();
    return new RekognitionClient({
      region: 'us-east-2',
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
      },
    });
  }
  
  async function detectText(photo) {
    try {  
      const params = {
        Image: {
          S3Object: {
            Bucket: 'examplebucket2s',
            Name: `public/${photo}`,
          },
        },
      };
  
      const client = await createRekognitionClient();
      const command = new DetectTextCommand(params);
      const response = await client.send(command);
      let textResults = [];
      let textCount = 0;
      response.TextDetections.forEach(text => {
        const confidence = text.Confidence;
        if (text.Type === "WORD") {
          if (textCount < 5) {
            textResults.push({
              text: text.DetectedText,
              confidence: confidence.toFixed(2)
            });
            textCount++;
          }
        }
      });
      return textResults;
  } catch (err) {
    console.error('Error detecting text:', err);
    return []; 
    }
  }
  
  export default detectText;