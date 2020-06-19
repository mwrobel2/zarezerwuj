export class Rezerwacje {
    constructor(
      public id: string,
      public miejsceId: string,
      public userId: string,
      public miejsceTitle: string,
      public miejsceImage: string,
      public firstName: string,
      public lastName: string,
      public guestNumber: number,
      public bookedFrom: Date,
      public bookedTo: Date
    ) {}
  }
