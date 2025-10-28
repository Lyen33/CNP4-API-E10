import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Enviroment } from "./enviroment.entity";

@Schema()
export class Variable extends Document{

    @Prop({
        index: true,
        required: true
    })
    name: string
    
    @Prop({
        required: true,
    })
    value: string
    
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
    readonly updated_at: string

    @Prop({
        required: false,
        default: false
    })
    is_sensitive: boolean

    @Prop({
        required: true,
    })
    enviromentName: string //nombre del Enviroment Padre

}

export const VariableSchema = SchemaFactory.createForClass(Variable);