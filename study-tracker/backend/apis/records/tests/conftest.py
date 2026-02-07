import os
import pytest
import boto3
from moto import mock_aws
from fastapi.testclient import TestClient


@pytest.fixture(autouse=True)
def aws_env():
    os.environ["AWS_ACCESS_KEY_ID"] = "testing"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
    os.environ["AWS_DEFAULT_REGION"] = "ap-northeast-1"
    os.environ["DYNAMODB_ENDPOINT"] = ""
    os.environ["DYNAMODB_REGION"] = "ap-northeast-1"
    os.environ["RECORDS_TABLE_NAME"] = "study-tracker-records"


@pytest.fixture
def dynamodb_mock(aws_env):
    with mock_aws():
        resource = boto3.resource("dynamodb", region_name="ap-northeast-1")

        resource.create_table(
            TableName="study-tracker-records",
            KeySchema=[
                {"AttributeName": "user_id", "KeyType": "HASH"},
                {"AttributeName": "record_id", "KeyType": "RANGE"},
            ],
            AttributeDefinitions=[
                {"AttributeName": "user_id", "AttributeType": "S"},
                {"AttributeName": "record_id", "AttributeType": "S"},
                {"AttributeName": "study_date", "AttributeType": "S"},
            ],
            GlobalSecondaryIndexes=[
                {
                    "IndexName": "date-index",
                    "KeySchema": [
                        {"AttributeName": "user_id", "KeyType": "HASH"},
                        {"AttributeName": "study_date", "KeyType": "RANGE"},
                    ],
                    "Projection": {"ProjectionType": "ALL"},
                }
            ],
            BillingMode="PAY_PER_REQUEST",
        )

        import handler
        original_resource = handler._get_dynamodb_resource
        handler._get_dynamodb_resource = lambda: resource

        yield resource

        handler._get_dynamodb_resource = original_resource


@pytest.fixture
def client(dynamodb_mock):
    from main import app
    return TestClient(app)
