class LRUCacheNode<K, V> {
  key: K
  value: V
  prev: LRUCacheNode<K, V> | null = null
  next: LRUCacheNode<K, V> | null = null

  constructor(key: K, value: V) {
    this.key = key
    this.value = value
  }
}

export default class LRUCache<K, V> {
  private capacity: number
  private cache: Map<K, LRUCacheNode<K, V>>
  private head: LRUCacheNode<K, V> | null = null
  private tail: LRUCacheNode<K, V> | null = null

  constructor(capacity: number) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key: K): V | undefined {
    const node = this.cache.get(key)
    if (node) {
      this.moveToHead(node)
      return node.value
    }
    return undefined
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!
      node.value = value
      this.moveToHead(node)
    } else {
      const newNode = new LRUCacheNode(key, value)
      if (this.cache.size >= this.capacity) {
        this.removeTail()
      }
      this.addToHead(newNode)
      this.cache.set(key, newNode)
    }
  }

  private moveToHead(node: LRUCacheNode<K, V>): void {
    this.removeNode(node)
    this.addToHead(node)
  }

  private removeNode(node: LRUCacheNode<K, V>): void {
    if (node.prev) node.prev.next = node.next
    if (node.next) node.next.prev = node.prev
    if (this.head === node) this.head = node.next
    if (this.tail === node) this.tail = node.prev
  }

  private addToHead(node: LRUCacheNode<K, V>): void {
    node.next = this.head
    node.prev = null
    if (this.head) this.head.prev = node
    this.head = node
    if (!this.tail) this.tail = node
  }

  private removeTail(): void {
    if (!this.tail) return
    this.cache.delete(this.tail.key)
    if (this.tail.prev) {
      this.tail.prev.next = null
      this.tail = this.tail.prev
    } else {
      this.head = null
      this.tail = null
    }
  }

  // monitoring methods
  public size(): number {
    return this.cache.size
  }

  public getCapacity(): number {
    return this.capacity
  }

  public getKeys(): K[] {
    return Array.from(this.cache.keys())
  }

  public getEntries(): [K, V][] {
    return Array.from(this.cache.entries()).map(([key, node]) => [key, node.value])
  }

  public getMostRecentKey(): K | undefined {
    return this.head?.key
  }

  public getLeastRecentKey(): K | undefined {
    return this.tail?.key
  }

  public getOrderedKeys(): K[] {
    const keys: K[] = []
    let current = this.head
    while (current) {
      keys.push(current.key)
      current = current.next
    }
    return keys
  }
}
