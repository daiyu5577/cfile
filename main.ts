#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const getAbsUrl = (url: string) => new URL(url, import.meta.url).href

const __dirname = getAbsUrl('./package.json')

const filePath: string = __dirname

console.log(filePath)