---
title: Python Trick
date: 2025-10-31 14:22:00 +0800
categories: [科研, Python]
tags: [python, research]     # TAG names should always be lowercase
---

## 精美的进度条

受够了 tqdm ？

```python
def mtqdm(iterable, desc="Processing..."):
    from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TimeElapsedColumn, TimeRemainingColumn
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("{task.percentage:>3.0f}%"),
        TimeElapsedColumn(),
        # TimeRemainingColumn(),
    ) as progress:
        task = progress.add_task(desc, total=len(iterable))
        for item in iterable:
            yield item
            progress.update(task, advance=1)
```

## 装饰器

不知道是不是卡了？

```python
def bind_start_end_log(text: str):
    def decorator(func):
        def wrapper(*args, **kwargs):
            from loguru import logger
            logger.info(f"START {text}")
            func(*args, **kwargs)
            logger.success(f"END {text}")
        return wrapper
    return decorator
```