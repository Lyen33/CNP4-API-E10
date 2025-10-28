import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document} from "mongoose";

@Schema()
export class Enviroment extends Document{

    @Prop({
        unique: true,
        index: true,
        required: true
    })
    name: string

    @Prop({
        required: false,
        default: null
    })
    description?: string

    @Prop({
        required: true,
        default: () => new Date().toISOString(),
    })
    readonly created_at: string

    @Prop({
        required: true,
        default: () => new Date().toISOString(),
    })
    @Prop()
    readonly updated_at: string
}

export const EnviromentSchema = SchemaFactory.createForClass(Enviroment);
