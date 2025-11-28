---
title: CUDA_VISIBLE_DEVICES 和 MUJOCO_EGL_DEVICE_ID 的冲突问题
date: 2025-11-28 14:25:00 +0800
categories: [科研, 具身智能]
tags: [ebodied-ai, research, mujoco]
---

今天在运行 LeRobot 的 SmolVLA 评估时，遇到了这样的报错：

```bash
Traceback (most recent call last):
  File "/map-vepfs/miniconda3/envs/lerobot/bin/lerobot-eval", line 10, in <module>
    sys.exit(main())
  File "/map-vepfs/haoxiao/shy/FastVLA/lerobot/src/lerobot/scripts/lerobot_eval.py", line 795, in main
    eval_main()
  File "/map-vepfs/haoxiao/shy/FastVLA/lerobot/src/lerobot/configs/parser.py", line 233, in wrapper_inner
    response = fn(cfg, *args, **kwargs)
  File "/map-vepfs/haoxiao/shy/FastVLA/lerobot/src/lerobot/scripts/lerobot_eval.py", line 511, in eval_main
    envs = make_env(cfg.env, n_envs=cfg.eval.batch_size, use_async_envs=cfg.eval.use_async_envs)
  File "/map-vepfs/haoxiao/shy/FastVLA/lerobot/src/lerobot/envs/factory.py", line 132, in make_env
    return create_libero_envs(
  File "/map-vepfs/haoxiao/shy/FastVLA/lerobot/src/lerobot/envs/libero.py", line 425, in create_libero_envs
    out[suite_name][tid] = env_cls(fns)
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/gymnasium/vector/sync_vector_env.py", line 97, in __init__
    self.envs = [env_fn() for env_fn in env_fns]
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/gymnasium/vector/sync_vector_env.py", line 97, in <listcomp>
    self.envs = [env_fn() for env_fn in env_fns]
  File "/map-vepfs/haoxiao/shy/FastVLA/lerobot/src/lerobot/envs/libero.py", line 351, in _make_env
    return LiberoEnv(
  File "/map-vepfs/haoxiao/shy/FastVLA/lerobot/src/lerobot/envs/libero.py", line 148, in __init__
    self._env = self._make_envs_task(task_suite, self.task_id)
  File "/map-vepfs/haoxiao/shy/FastVLA/lerobot/src/lerobot/envs/libero.py", line 232, in _make_envs_task
    env = OffScreenRenderEnv(**env_args)
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/libero/libero/envs/env_wrapper.py", line 161, in __init__
    super().__init__(**kwargs)
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/libero/libero/envs/env_wrapper.py", line 56, in __init__
    self.env = TASK_MAPPING[self.problem_name](
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/libero/libero/envs/problems/libero_floor_manipulation.py", line 37, in __init__
    super().__init__(bddl_file_name, *args, **kwargs)
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/libero/libero/envs/bddl_base_domain.py", line 137, in __init__
    super().__init__(
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/environments/manipulation/manipulation_env.py", line 162, in __init__
    super().__init__(
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/environments/robot_env.py", line 214, in __init__
    super().__init__(
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/environments/base.py", line 143, in __init__
    self._reset_internal()
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/libero/libero/envs/bddl_base_domain.py", line 737, in _reset_internal
    super()._reset_internal()
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/environments/robot_env.py", line 510, in _reset_internal
    super()._reset_internal()
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/environments/base.py", line 296, in _reset_internal
    render_context = MjRenderContextOffscreen(self.sim, device_id=self.render_gpu_device_id)
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/utils/binding_utils.py", line 210, in __init__
    super().__init__(sim, offscreen=True, device_id=device_id, max_width=max_width, max_height=max_height)
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/utils/binding_utils.py", line 78, in __init__
    self.gl_ctx = GLContext(max_width=max_width, max_height=max_height, device_id=self.device_id)
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/renderers/context/egl_context.py", line 121, in __init__
    EGL_DISPLAY = create_initialized_egl_device_display(device_id=device_id)
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/renderers/context/egl_context.py", line 61, in create_initialized_egl_device_display
    raise RuntimeError(
RuntimeError: The MUJOCO_EGL_DEVICE_ID environment variable must be an integer between 0 and 0 (inclusive), got 3.
Exception ignored in: <function EGLGLContext.__del__ at 0x7f77a4828940>
Traceback (most recent call last):
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/renderers/context/egl_context.py", line 155, in __del__
    self.free()
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/renderers/context/egl_context.py", line 146, in free
    if self._context:
AttributeError: 'EGLGLContext' object has no attribute '_context'
Exception ignored in: <function MjRenderContext.__del__ at 0x7f77a4828af0>
Traceback (most recent call last):
  File "/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/utils/binding_utils.py", line 198, in __del__
    self.con.free()
AttributeError: 'MjRenderContextOffscreen' object has no attribute 'con'
```

对于 CUDA_VISIBLE_DEVICES，众所周知，它会屏蔽没有在其列表中的显卡。如设 CUDA_VISIBLE_DEVICES 为 3,4 时，程序只能通过下标索引 0（或1） 获取到显卡 3（或4）。

对于 MUJOCO_EGL_DEVICE_ID，它是我们上面指代的索引。因此，这样指定两个环境变量是合适的（我这里想要使用实际编号为 3 的显卡）：

```json
"terminal.integrated.env.linux": {
    "CUDA_VISIBLE_DEVICES": "3",
    "MUJOCO_EGL_DEVICE_ID": "0"
}
```

但在文件 `/map-vepfs/miniconda3/envs/lerobot/lib/python3.10/site-packages/robosuite/utils/binding_utils.py` 中有校验，在 ~34 行检查 MUJOCO_EGL_DEVICE_ID 的值是否在 CUDA_VISIBLE_DEVICES 中，这是一个不合理的检查，注释掉即可。