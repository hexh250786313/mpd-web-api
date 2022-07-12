import { createApp } from './app'

function main() {
  try {
    createApp()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
