import jieba
import random

class Data:
    r"""
    Input data should be a dict.

    ```py
    data = {
        0: "A string...",
        1: "Another string...",
        ...
        11: "The last string...",
    }
    ```
    """

    def __init__(self, data: dict, padding_length: int) -> None:
        self.raw = data
        self.data = dict()
        self.dataset = list()
        self.lengrh = len(data)
        self.tokens = set(["<PAD>"])
        self.w2i = dict()

        self.cleaning()
        print("Cleaning completed.")
        self.toDataset()
        print("ToDataset completed.")
        self.argumantation()
        print("Argumantation completed.")
        self.tokenlization()
        print("Tokenlization completed.")
        self.padding(padding_length)
        print("Padding completed.")
        self.token2id()
        print("Token2id completed.")
        self.onehot_encode()
        print("Process completed.")

    def cleaning(self) -> None:
        for index in range(self.lengrh):
            result = ""

            for char in self.raw[index]:
                # Check if Chinese.
                if '\u4e00' <= char <= '\u9fff':
                    result += char
                
                # Check if leggal char.
                elif char in set(["，", "、", "。", "？", "！"]):
                    result += char

            # Store cleaned data.
            self.data[index] = result

    def toDataset(self) -> None:
        for index in range(self.lengrh):
            result = ""

            for char in self.data[index]:
                result += char
                if char in set(["。", "？", "！"]):
                    result += "|"

            self.data[index] = result.split("|")

        result = []
        for index in range(self.lengrh):
            for sentance in self.data[index]:
                if sentance:
                    result.append([sentance, index])

        self.dataset = result

    def argumantation(self) -> None:
        result = []

        for i in range(len(self.dataset)):
            [sentance, index] = self.dataset[i]
            result.append([sentance, index])

            # Generate new data.
            d1 = sentance.split("，")
            random.shuffle(d1)
            d1 = "，".join(d1)
            result.append([d1, index])

            d2 = sentance.split("、")
            random.shuffle(d2)
            d2 = "、".join(d2)
            result.append([d2, index])

        self.dataset = result

    def tokenlization(self) -> None:
        result = []

        for sentance, index in self.dataset:
            temp = []

            for token in jieba.cut(sentance):
                # Remove keywords.
                # There are two names of Aries in Chinese, one is 白羊座,
                # the other is 牡羊座, so we need to remove both of them.
                if token in set(["白羊座", "牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"]): continue

                self.tokens.add(token)
                temp.append(token)

            result.append([temp, index])
        
        self.dataset = result

    def padding(self, length: int) -> None:
        result = []

        for sentance, index in self.dataset:
            if len(sentance) > length:
                sentance = sentance[:length]
            else:
                sentance = sentance + [("<PAD>")] * (length - len(sentance))

            result.append([sentance, index])
        
        self.dataset = result

    def token2id(self) -> None:
        result = []

        # Create word-to-index index.
        self.w2i = {word: index for index, word in enumerate(self.tokens)}

        # Output word2index dict.
        with open("./word2index.txt", "+w") as f:
            for _, k in enumerate(self.w2i):
                f.write(f"\"{k}\": {self.w2i[k]},\n")

        for sentance, index in self.dataset:
            temp = []
            for token in sentance:
                temp.append(self.w2i[token])
            result.append([temp, index])

        self.dataset = result

    def onehot_encode(self) -> None:
        result = []

        for sentance, index in self.dataset:
            temp = [0] * self.lengrh
            temp[index] = 1
            index = temp
            result.append([sentance, index])

        self.dataset = result

    def get(self, option: str) -> list:
        r"""
        Valid options:
        - data
        - token_len
        """

        if option == "data":
            return self.dataset
        if option == "token_len":
            return len(self.tokens)