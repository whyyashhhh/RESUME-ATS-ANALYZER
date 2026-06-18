from __future__ import annotations

import time
from collections import defaultdict, deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limits: dict[str, tuple[int, int]]) -> None:
        super().__init__(app)
        self.limits = limits
        self.requests: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next) -> Response:
        limit = self.limits.get(request.url.path)
        if limit is None:
            return await call_next(request)

        max_requests, window_seconds = limit
        client_host = request.client.host if request.client else 'anonymous'
        key = f'{client_host}:{request.url.path}'
        current_time = time.time()
        request_times = self.requests[key]

        while request_times and current_time - request_times[0] > window_seconds:
            request_times.popleft()

        if len(request_times) >= max_requests:
            return JSONResponse(
                status_code=429,
                content={'detail': 'Too many requests. Please try again later.'},
            )

        request_times.append(current_time)
        return await call_next(request)