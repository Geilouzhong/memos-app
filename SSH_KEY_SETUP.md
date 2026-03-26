# SSH 密钥配置完成

## 📋 你的 SSH 公钥

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOIqfVT8ShumordFexQRxAtev8xVPGYLO6WWX+XeBTIs memos-app@NanoPC-T4
```

## 🔐 配置步骤

### 1. 添加 SSH 公钥到 GitHub

1. 访问：https://github.com/settings/keys
2. 点击 "New SSH key"
3. Title 填写：`NanoPC-T4 - MemosApp`
4. Key 粘贴上面的公钥
5. 点击 "Add SSH key"

### 2. 测试 SSH 连接

```bash
ssh -T git@github.com-memos
```

首次连接会提示：
```
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

输入 `yes`，应该看到：
```
Hi Geilouzhong! You've successfully authenticated, but GitHub does not provide shell access.
```

### 3. 推送代码到 GitHub

```bash
cd /home/pi/MemosApp
git push -u origin main
```

## 📁 密钥文件位置

- **私钥**：`~/.ssh/id_ed25519_memos`
- **公钥**：`~/.ssh/id_ed25519_memos.pub`
- **SSH 配置**：`~/.ssh/config.d/memos-app`

## 🔧 已配置

- ✅ SSH 密钥已生成（ED25519）
- ✅ Git 远程仓库已连接到 `git@github.com:Geilouzhong/memos-app.git`
- ✅ GitHub 已添加到 known_hosts

## ⚠️ 安全提示

私钥文件 `~/.ssh/id_ed25519_memos` 请妥善保管，不要泄露给他人！

---

**配置完 GitHub SSH key 后，运行推送命令即可！**
