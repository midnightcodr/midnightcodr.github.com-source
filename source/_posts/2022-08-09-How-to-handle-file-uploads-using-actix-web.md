title: How to handle file uploads using actix-web
date: 2022-08-09 23:21:59
tags:
- rust
- actix-web
- how-to
---
In this tutorial I'll demonstrate how to handle upload with additional data fields using one of the most popular Rust web frameworks - [actix-web](https://github.com/actix/actix-web), which has become my go-to web framework when developing in Rust.

We'll start by creating a binary Rust package
```bash
cargo new doc-demo
```

Then under the project root, run
```bash
cargo add actix-web actix-multipart
```

With your favorite editor, open `src/main.rs` and copy/paste the following code

```rust
use serde::Serialize;
use actix_multipart::Multipart;
use futures_util::TryStreamExt as _;

use actix_web::{ post, App, Error as ActixError, HttpResponse, HttpServer };

#[derive(Serialize)]
struct Stats {
    lines: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    word_count: Option<usize>
}

#[post("/upload_stats")]
async fn upload_stats(
    mut payload: Multipart,
) -> Result<HttpResponse, ActixError> {
    let mut file_data = Vec::<u8>::new();
    let mut layout: Option<String> = Some("simple".to_owned());
    while let Some(mut field) = payload.try_next().await? {
        let content_disposition = field.content_disposition();
        let field_name = content_disposition.get_name().unwrap();
        match field_name {
            "file" => {
                while let Some(chunk) = field.try_next().await? {
                    file_data.extend_from_slice(&chunk);
                }
            }
            "layout" => {
                let bytes = field.try_next().await?;
                layout = String::from_utf8(bytes.unwrap().to_vec()).ok();
            }
            _ => {}
        }
    }
    let file_content = std::str::from_utf8(&file_data)?;
    let mut i = 0;
    let mut word_count=0;
    for line in file_content.lines() {
        word_count+=line.chars().count();
        i += 1;
    }
    let word_count_res = if layout.unwrap() == String::from("advanced") {
        Some(word_count)
    } else {
        None
    };
    Ok(HttpResponse::Ok().json(Stats {
        lines: i,
        word_count: word_count_res
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
     HttpServer::new(move || {
        App::new()
            .service(upload_stats)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```
This simple web application has only one single POST endpoint that will accept
1. a field named `file` that points to a file in client's file system
2. an optional field named `layout`, its value is defaulted to `simple`

By default the output will be the line count of the file being uploaded, but a `characters` result that represents the number of characters in the file will be added if `layout` is set to `advanced`. So for example, 
```bash
curl http://localhost:8080/upload_stats -X POST -F 'file=@Cargo.toml'
```
returns something like
```json
{"lines": 13}
```
While
```bash
curl http://localhost:8080/upload_stats -X POST -F 'file=@Cargo.toml' -F 'layout=advanced'
```
might produce something like 
```json
{"lines": 13, "characters": 311}
```

p.s. here's the full content of `Cargo.toml`
```toml
[package]
name = "doc-demo"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
actix-multipart = "0.4.0"
actix-web = "4.1.0"
futures-util = "0.3.21"
serde = { version = "1.0.136", features = ["derive"] }
serde_json = "1.0.81"
```