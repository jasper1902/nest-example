# Entity-Relationship Diagram
> Generated by [`prisma-markdown`](https://github.com/samchon/prisma-markdown)

- [default](#default)

## default
```mermaid
erDiagram
"user" {
  String _id PK
  String username
  String email UK
  DateTime emailVerified "nullable"
  String image "nullable"
  String password "nullable"
  String bio "nullable"
  String googleId "nullable"
  DateTime createdAt
  DateTime updatedAt
  Role role
}
```

### `user`

**Properties**
  - `_id`: 
  - `username`: 
  - `email`: 
  - `emailVerified`: 
  - `image`: 
  - `password`: 
  - `bio`: 
  - `googleId`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `role`: 