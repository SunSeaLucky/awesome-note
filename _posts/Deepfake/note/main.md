# Deepfake Detection

## 实验

做实验时发现可以使用 writer.add_text() 配合 pandas 生成参数表：

```Python
writer.add_text("profile", pd.DataFrame({
	"project_name": project_name, 
	"description": description, 
	"time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
	"result_folder": this_run_folder
}).T.reset_index().rename(columns={"index": "key", 0: "value"}).to_markdown(index=False))
```

这样在 tensorboard 中就可以看到参数表了。

## 组会

1. 论文一套逻辑，实验一套逻辑
1. 找创新不能顺着自己领域的技术去找，因为大家都知道
1. 看到的论文，做的时候，实际上是发表的时间的好几年前的思路。一定要有自己的思路
1. 敢于大修大改（对应软件工程中的：勇气）