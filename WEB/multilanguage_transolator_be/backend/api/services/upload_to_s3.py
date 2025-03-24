import boto3
from botocore.exceptions import NoCredentialsError
import os

def upload_to_s3(file, bucket_name, object_name=None):
    """
    Upload a file to an S3 bucket

    :param file: File object to upload
    :param bucket_name: S3 bucket name
    :param object_name: S3 object name. If not specified, file.name is used
    :return: URL of the uploaded file if successful, else None
    """
    # If S3 object_name was not specified, use file.name
    if object_name is None:
        object_name = file.name

    # Create an S3 client
    s3_client = boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_S3_REGION_NAME')
    )

    # Determine Content-Disposition and Content-Type
    content_disposition = 'inline' if object_name.endswith('.pdf') else 'attachment'
    content_type = 'application/pdf' if object_name.endswith('.pdf') else 'binary/octet-stream'

    try:
        # Upload the file
        s3_client.upload_fileobj(
            file,
            bucket_name,
            object_name,
            ExtraArgs={
                'ContentDisposition': content_disposition,
                'ContentType': content_type
            }
        )
        print(f"File {object_name} uploaded to {bucket_name}/{object_name}")
        
        # Generate the public URL
        public_url = f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
        return public_url
    except FileNotFoundError:
        print("The file was not found")
        return None
    except NoCredentialsError:
        print("Credentials not available")
        return None
    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        return None