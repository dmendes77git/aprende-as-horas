import asyncio
from time_teacher_app import TimeTeacherApp

async def main():
    app = TimeTeacherApp()
    await app.async_run()

if __name__ == "__main__":
    asyncio.run(main())
