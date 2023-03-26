import pandas as pd
from ..utils.data_wrangling import FillingNA, Normalization
from ..firebase.get_data_file import get_data_doc
from ..utils.table_operation import find_column_dtype


def wrangling(data_id: str, df: pd.DataFrame, affected_columns: list[str], filling_na_numeric: str, filling_na_categorical: str, normalization_numeric: str, normalization_categorical: str):
    _data_keys = get_data_doc(data_id)['keys']
    # Wrangling
    for column_name in affected_columns:
        # Filling NA
        if len(find_column_dtype(_data_keys, column_name)) == 0:
            # Numeric
            if filling_na_numeric == 'mean':
                df = FillingNA.fill_with_mean(df, column_name)
        else:
            # Categorical
            if filling_na_categorical == 'most_frequent':
                df = FillingNA.fill_with_frequency(df, column_name)
        # Normalization
        if len(find_column_dtype(_data_keys, column_name)) == 0:
            # Numeric
            if normalization_numeric == 'min_max_scaling':
                df = Normalization.min_max(df, column_name)
            elif normalization_numeric == 'z_score':
                df = Normalization.z_score(df, column_name)
        else:
            # Categorical
            if normalization_categorical == 'numeric_encoding':
                _categorical = find_column_dtype(_data_keys, column_name)
                df = Normalization.categorical_to_numeric(
                    df, column_name, _categorical)
    return df
