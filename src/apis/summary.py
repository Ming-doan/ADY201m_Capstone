import pandas as pd
from ..firebase.get_data_file import get_data_doc
from ..utils.table_operation import find_column_dtype


def summary(data_id: str, df: pd.DataFrame, column_name: str):
    _data_keys = get_data_doc(data_id)['keys']
    # Summary
    if len(find_column_dtype(_data_keys, column_name)) == 0:
        # Numeric
        return {
            'type': 'numeric',
            'min': str(df[column_name].min()),
            'max': str(df[column_name].max()),
            'mean': str(df[column_name].mean()),
            'std': str(df[column_name].std()),
        }
    else:
        # Categorical
        return {
            'type': 'categorical',
            'unique': find_column_dtype(_data_keys, column_name),
        }
