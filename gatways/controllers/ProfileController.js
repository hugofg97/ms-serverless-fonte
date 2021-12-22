const useCases = require("../../application/use_cases/main");
const serviceLocator = require("../../core/config/serviceLocator");
const SubscriberService = require("../services/SubscriberService");
const {createCustomer, getCustomers,getCustomerById} = require('../../core/config/libs/payment/pagarme/apis/customers')
const AWS = require('aws-sdk');
const { Buffer } = require('buffer');
const { isRequired, validateDocument } = require("../../core/config/libs/validator");
const {
  handleError,
  successfullyRead,
} = require("../../core/config/libs/ResponseService");

class ProfileController {
  constructor() {
    this.service = new SubscriberService();
  }

  async privacity() {
    try {
      const a = await getCustomerById({ id: 'cus_Lo9rwKPhlpFJg6NE' })
      const privacity = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
      return successfullyRead({ data: privacity });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
  async profileImage({ body, pathParameters }) {
    try {
      const { document } = pathParameters;
      const { image } = JSON.parse(body);
      
      isRequired(document);
      isRequired(image);
      validateDocument(document);

      const documentExists = await this.service.findByDocument({ document: document }, { FindOneSubscriber: useCases.Subscriber.FindByDocument }, serviceLocator);
      if (!documentExists) throw 400;

      const base64Image = image.split(';base64,').pop();
      const bufferImg = Buffer.from(base64Image, 'base64');

      const s3 = new AWS.S3({
        params: {
          Bucket: process.env.AWS_BUCKET_NAME
        },
      });

      const data = {
        Key: `${process.env.AWS_PASTE_PROFILE_IMAGES}/${document}.jpeg`,
        Body: bufferImg,
        Bucket: process.env.AWS_BUCKET_NAME,
        ContentEncoding: 'image/jpeg',
        ACL: "public-read"
      }
      const upload = await s3
        .putObject(data, function (err, data) {
          if (err) {
            console.log('Error uploading data: ', err);
          }
        })
        .promise().then(d => true).catch(e => false);
      if (!upload) throw 400;
      const imageUrl = `${process.env.AWS_URL_BUCKET}/${process.env.AWS_PASTE_PROFILE_IMAGES}/${document}.jpeg`;
      const saveDbImageLink = await this.service.setUrlImageProfile({ document: document, profileImage: imageUrl }, { SetProfileImage: useCases.Subscriber.SetProfileImage }, serviceLocator);
      if(!saveDbImageLink) throw 400;
      return successfullyRead({ data: { imageUrl: imageUrl, fullUserData: saveDbImageLink } });
    } catch (error) {
      return handleError(error);
    }
  }
  async support() {
    try {
      const privacity = [
        {
          title: "Titulo 1",
          content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the `,
        },
        {
          title: "Titulo 2",
          content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the `,
        },
        {
          title: "Titulo 3",
          content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the `,
        },
        {
          title: "Titulo 4",
          content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the `,
        },
        {
          title: "Titulo 5",
          content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the `,
        },
        {
          title: "Titulo 6",
          content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the `,
        },
      ];
      return successfullyRead({ data: privacity });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }

  async update() { }
}

module.exports = ProfileController;
