from app.ai import generate_task_description


def suggest_description_service(title: str):
    return generate_task_description(title)