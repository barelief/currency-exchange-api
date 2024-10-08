class LRUCacheNode<K, V> {
  key: K
  value: V
  expiry: number
  prev: LRUCacheNode<K, V> | null = null
  next: LRUCacheNode<K, V> | null = null

  constructor(key: K, value: V, ttl: number) {
    this.key = key
    this.value = value
    this.expiry = Date.now() + ttl
  }
}

export default class LRUCache<K, V> {
  private capacity: number
  private ttl: number // TTL in milliseconds
  private cache: Map<K, LRUCacheNode<K, V>>
  private head: LRUCacheNode<K, V> | null = null
  private tail: LRUCacheNode<K, V> | null = null

  constructor(capacity: number, ttl: number) {
    this.capacity = capacity
    this.ttl = ttl
    this.cache = new Map()
  }

  // Retrieve value and move the accessed node to the head
  get(key: K): V | undefined {
    const node = this.cache.get(key)
    if (node && Date.now() < node.expiry) {
      this.moveToHead(node)
      return node.value
    } else if (node) {
      // Node has expired, remove it
      this.removeNode(node)
      this.cache.delete(key)
    }
    return undefined
  }

  // Add or update the key-value pair
  set(key: K, value: V): void {
    const currentTime = Date.now()
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!
      if (currentTime < node.expiry) {
        node.value = value
        node.expiry = currentTime + this.ttl
        this.moveToHead(node)
      } else {
        // Node expired, remove and add new node
        this.removeNode(node)
        this.cache.delete(key)
        const newNode = new LRUCacheNode(key, value, this.ttl)
        this.addToHead(newNode)
        this.cache.set(key, newNode)
      }
    } else {
      const newNode = new LRUCacheNode(key, value, this.ttl)
      if (this.cache.size >= this.capacity) {
        this.removeTail()
      }
      this.addToHead(newNode)
      this.cache.set(key, newNode)
    }
  }

  // Move a node to the head
  private moveToHead(node: LRUCacheNode<K, V>): void {
    this.removeNode(node)
    this.addToHead(node)
  }

  // Remove a specific node
  private removeNode(node: LRUCacheNode<K, V>): void {
    if (node.prev) node.prev.next = node.next
    if (node.next) node.next.prev = node.prev
    if (this.head === node) this.head = node.next
    if (this.tail === node) this.tail = node.prev
  }

  // Add a node to the head of the cache
  private addToHead(node: LRUCacheNode<K, V>): void {
    node.next = this.head
    node.prev = null
    if (this.head) this.head.prev = node
    this.head = node
    if (!this.tail) this.tail = node
  }

  // Remove the tail node (least recently used)
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

  /** 
    Cache monitoring methods
  */

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

  // Returns all keys in the order from most to least recently used
  public getOrderedKeys(): K[] {
    const keys: K[] = []
    let current = this.head
    while (current) {
      keys.push(current.key)
      current = current.next
    }
    return keys
  }

  // get all expiration dates in Date() format
  public getExpiryData(): number[] {
    const keys: number[] = []
    let current = this.head
    while (current) {
      keys.push(current.expiry)
      current = current.next
    }
    return keys
  }

  // Returns all keys along with their expiration status and time until expiration
  public getKeysWithExpirations(): Array<{
    key: K
    isExpired: boolean
    msUntilExpiration: number
  }> {
    const keysWithExpirations: Array<{ key: K; isExpired: boolean; msUntilExpiration: number }> = []
    const now = Date.now()
    let current = this.head
    while (current !== null) {
      const msUntilExpiration = Math.max(0, current.expiry - now)
      keysWithExpirations.push({
        key: current.key,
        isExpired: msUntilExpiration === 0,
        msUntilExpiration: msUntilExpiration,
      })
      current = current.next
    }
    return keysWithExpirations
  }
}
