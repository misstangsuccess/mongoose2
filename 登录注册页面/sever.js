const express = require("express");
const {resolve}=require("path");
//引入mongoose模块
const mongoose = require("mongoose");
//连接数据模块
require("./db");
//集合约束模块
const userInfoSchema = require("./userinfo");
//创建集合
const userInfo = mongoose.model("userInfo", userInfoSchema);
const app = express();
//注册的接口
app.get("/register", async (req, res) => {
  /* 
  1.获取用户数据
  2.判断是否已经注册
  3.若没有注册则保存到数据库
  4.返回响应
   */
  //1.获取用户数据
  //console.log(req.query);//{ user: 'tan', pass: '123' }
  const { user, pass } = req.query;
  console.log(user, pass);
  //2判断是否已经注册

  //find返回的是一个数组,找不到返回空数组;findOne返回的是查找的对象,找不到返回null
  const isHasUser = await userInfo.findOne({
    user,
  });
  console.log(isHasUser);
  if (isHasUser) {
    if (isHasUser.user === user) {
      res.send("用户名被注册");
      return;
    }
  }

  //3.保存到数据库
  const saveResult = await userInfo.create({
    user,
    pass,
  });
  console.log(saveResult);
  //4返回响应
  //res.send("注册成功");
  //注册成功后直接跳转登录页面
  res.sendFile(resolve(__dirname,"./login.html"))
});
//登录的接口
app.get("/login", async (req, res) => {
  /* 
  1.获取用户的数据
  2.判断是否存在当前用户名
  3.判断密码是否正确
  4.返回成功响应
   */
  //1.获取用户的数据
  console.log(req.query);
  const { user, pass } = req.query;
  //2.判断是否存在当前用户名
  const isHasUser = await userInfo.findOne({
    user,
  });
  console.log(isHasUser);
  if (!isHasUser) {
    return res.send("用户名不存在");
  }
  // 3.判断密码是否正确
  //isHasUser其中已经包含的密码
  if(isHasUser.pass===pass){
    res.send("登录成功")
  }else{
    res.send("密码错误")
  }
  
});
app.get("/register.html",async (req,res)=>{
  res.sendFile(resolve(__dirname,"./register.html"))
})
app.get("/login.html",async (req,res)=>{
  res.sendFile(resolve(__dirname,"./login.html"))
})
app.listen("3000", (err) => {
  if (err) {
    console.log("启动失败" + err);
    return;
  }
  console.log("启动成功 http://127.0.0.1:3000");
});
