# Constellator

A text-based constellation analysis AI.

## Usage

1. Access [Constellator](https://91d906h4.github.io/constellator/)
2. Input a prompt string like "神秘內斂，充滿了熱情和直覺，擁有強烈的意志力和洞察力".
3. Press "分析！" button, then you will get the result like this:

<div align="center">
    <img src="./asset/demo.png" />
</div>

## Model

The machine learning model is designed to analyze the astrological sign of people by a single sentance.

### Architecture

The following is the architecture of Constellator. It employs an architecture that integrates Bidirectional Long Short-Term Memory (LSTM) and Self-Attention mechanisms.

<details>
    <summary>Architecture</summary>
    <div align="center">
        <img src="./asset/architecture.png" />
    </div>
</details>

### Training Process

1. Loss Function

The loss function is the cross-entropy loss function.

2. Optimizer

The optimizer is SGD optimizer with a learning rate of 0.01.

## Barnum Effect

Many (almost all) astrological analyses use Barum Effct, so it can be challenging to determine a preson's constellation from a single sentance.

Here are some sentances descripbing your personality using Barnum Effect:

1. You have a great need for other people to like and admire you.
2. You have a tendency to be critical of yourself.
3. You have a great deal of unused capacity which you have not turned to your advantage.
4. While you have some personality weaknesses, you are generally able to compensate for them.
5. Your sexual adjustment has presented problems for you.
6. Disciplined and self-controlled outside, you tend to be worrisome and insecure inside.
7. At times you have serious doubts as to whether you have made the right decision or done the right thing.
8. You prefer a certain amount of change and variety and become dissatisfied when hemmed in by restrictions and limitations.
9. You pride yourself as an independent thinker and do not accept others' statements without satisfactory proof.
10. You have found it unwise to be too frank in revealing yourself to others.
11. At times you are extroverted, affable, sociable, while at other times you are introverted, wary, reserved.
12. Some of your aspirations tend to be pretty unrealistic.
13. Security is one of your major goals in life.

## References

[1] A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, L. Kaiser, and I. Polosukhin, "Attention Is All You Need," arXiv:1706.03762v7 [cs.CL], Aug. 2023.<br />
[2] "Barum Effct," wikipedia.org. https://en.wikipedia.org/wiki/Barnum_effect (accessed Apr. 3, 2024).