import pandas as pd


def drop_column(df: pd.DataFrame, column_name: str):
    return df.drop(column_name, axis=1)


def find_column_dtype(keys, column_name) -> list | None:
    for key in keys:
        if key['key'] == column_name:
            return key['dtype']
