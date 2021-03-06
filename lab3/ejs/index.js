const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer().single('file'))

// 设置静态路径
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))
// set the view engine to ejs
app.engine('.html', require('ejs').__express)
// 设置视图路径
app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'html')

const defaultData = {
  title: '',
  username: '',
  id: '',
  classes: '',
  avatar: '',
  desc: '',
  time: ''
}

function getCurrentTime() {
  const date = new Date(Date.now())

  const YY = date.getFullYear()
  const MM = (date.getMonth() + 1).toString().padStart(2, '0')
  const DD = date.getDate().toString().padStart(2, '0')
  const hh = date.getHours().toString().padStart(2, '0')
  const mm = date.getMinutes().toString().padStart(2, '0')
  const ss = date.getSeconds().toString().padStart(2, '0')

  return YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss
}

// index page
app.get('/', (req, res) => {
  res.render('index', {
    ...defaultData
  })
})

app.get('/:id', (req, res) => {
  const { id } = req.params
  res.end(fs.readFileSync(`uploads/html/${id}.html`, 'utf-8'))
})

// 上传接口
app.post('/', (req, res) => {
  const { id, username, classes, desc } = req.body
  let avatarName = ''
  let avatarPath = ''
  let filePath = ''
  if (req.file) {
    const buffer = req.file.buffer
    avatarName = id + '-' + Date.now() + path.parse(req.file.originalname).ext
    avatarPath = `uploads/avatars/${avatarName}`
    fs.writeFileSync(avatarPath, buffer)
  }
  const data = {
    ...defaultData,
    id,
    username,
    classes,
    desc,
    avatar: `avatars/${avatarName}`,
    time: getCurrentTime()
  }

  res.render('template', data, function (err, str) {
    if (err) {
      console.log(err)
    } else {
      filePath = 'uploads/html/' + id + '.html'
      fs.writeFileSync(filePath, str)
      res.end(str)
    }
    // str => 输出绘制后的 HTML 字符串
  })
})

app.post('/search', (req, res) => {
  const { id } = req.body
  res.end(fs.readFileSync(`uploads/html/${id}.html`, 'utf-8'))
})

app.listen(port)
console.log('Server is listening on port 8080')
