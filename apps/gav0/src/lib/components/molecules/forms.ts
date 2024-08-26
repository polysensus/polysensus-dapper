enum FormMethodName {
  POST = "POST",
  GET = "GET"
}

type FormMethod = keyof typeof FormMethodName;