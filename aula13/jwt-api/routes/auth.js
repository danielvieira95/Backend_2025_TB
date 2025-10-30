// codigo da rota para registrar usuario e realizar login

const express = require("express"); // biblioteca para criar o servidor 
const bcrypt= require("bcryptjs"); // biblioteca para criptografar a senha
const jwt = require("jsonwebtoken"); // autenticação json
const {z} = require("zod"); // biblioteca para realizar validação dos dados
const User = require("../models/User"); // importa o modelo de usuario
const auth = require("../middleware/auth")

const router = express.Router();

// Schemas de validação

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

// Função para fazer o token
function signToken(user){
    // sub = subject (id do usuario)
    return jwt.sign(
        {  sub: user._id.toString(),email:user.email,name:user.name},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN || "Id"}

        
    );
}

// rota post register
router.post("/register",async(req,res)=>{
    try{
        const {name,email,password} = registerSchema.parse(req.body);
        //  verifica se o email ja existe
        const exists = await User.findOne({email});

        if(exists) res.status(409).json({error: "Email já cadastrado !"});
        const passwordHash = await bcrypt.hash(password,12);
        const user = await User.create({name,email,passwordHash});
        // gera o token de autenticação
        const token = signToken(user);
        return res.status(201).json({
            message:"Usuario registrado com sucesso",
            user:{id: user._id, name: user.name,email: user.email},
            token
        });

    }catch(err){
        if(err?.issues){
            return res.status(400).json({error: "Dados inválidos",details: err.issues});
        }
        return res.status(500).json({error: "Erro ao registrar"});
    }
});


// Post /auth/login

router.post("/login",async(req,res)=>{
    try{
        const {email,password} = loginSchema.parse(req.body);
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({error: "Credenciais inválidas"});
        // realiza comparação da senha do usuario com a senha hash

        const ok = await bcrypt.compare(password,passwordHash); 
        if(!ok) return res.status(401).json({error: "Credenciais invalidas"});

        const token = signToken(user);
        return res.json({
            message: "Login realizado",
            user:{id: user._id,name:user.name, email:user.email},
            token
        });
    } catch(err){
        if(err?.issues){
            return res.status(400).json({error: "Dados inválidos", details: err.issues});
        }
        return res.status(500).json({error:"Erro no login"})
    }
});


// Get para a rota protegida /auth/me (protegida)

router.get("/me",auth,async(req,res)=>{
    return res.json({user: req.user})
});

module.exports = router;

