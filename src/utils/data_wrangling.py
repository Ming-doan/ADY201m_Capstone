import pandas as pd


class FillingNA:
    @staticmethod
    def fill_with_mean(df: pd.DataFrame, column: str, missing_value: str = pd.NA) -> pd.DataFrame:
        df[column] = df[column].replace(
            missing_value, df[column].mean(numeric_only=True))
        return df

    @staticmethod
    def fill_with_frequency(df: pd.DataFrame, column: str, missing_value: str = pd.NA) -> pd.DataFrame:
        """Fill missing values with frequency"""
        df[column] = df[column].replace(
            missing_value, df[column].value_counts().index[0])
        return df


class Normalization:
    @staticmethod
    def min_max(df: pd.DataFrame, column: str, min: int = None, max: int = None) -> pd.DataFrame:
        """Min-Max Normalization"""
        if min is None:
            min = df[column].min()
        if max is None:
            max = df[column].max()
        df[column] = (df[column] - min) / (max - min)
        return df

    @staticmethod
    def z_score(df: pd.DataFrame, column: str) -> pd.DataFrame:
        """Z-Score Normalization"""
        df[column] = (df[column] - df[column].mean()) / df[column].std()
        return df

    @staticmethod
    def categorical_to_numeric(df: pd.DataFrame, column: str, categorical: list = None, numeric: list = None) -> pd.DataFrame:
        """Categorical to Numeric Normalization"""
        if categorical is None:
            categorical = df[column].unique()
        if numeric is None:
            numeric = list(range(0, len(categorical)))
        df[column] = df[column].replace(categorical, numeric)
        return df
